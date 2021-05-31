import { Database } from 'arangojs'
import { Algorithm, SignOptions, VerifyOptions } from 'jsonwebtoken'
import { ulid } from 'ulid'
import { createEdgeAdapter, deleteEdgeAdapter } from './adapters/content-graph/arangodb/adapters/edge'
import { globalSearch } from './adapters/content-graph/arangodb/adapters/globalSearch'
import { createNodeAdapter, getNodeByIdAdapter } from './adapters/content-graph/arangodb/adapters/node'
import { graphqlArangoContentGraphResolvers } from './adapters/content-graph/arangodb/graphql/additional-resolvers'
import { createGraphQLApp } from './adapters/http/graphqlApp'
import { startMNHttpServer } from './adapters/http/MNHTTPServer'
import { createStaticAssetsApp } from './adapters/http/staticAssetsApp'
import { createTempAdapter } from './adapters/staticAssets/fs/adapters/createTemp'
import { delAssetAdapter } from './adapters/staticAssets/fs/adapters/delAsset'
import { getAssetAdapter } from './adapters/staticAssets/fs/adapters/getAsset'
import { persistTempAssetsAdapter } from './adapters/staticAssets/fs/adapters/persistTemp'
import { setupFs } from './adapters/staticAssets/fs/setup'
import { activateNewUser, storeNewSignupRequest } from './adapters/user-auth/arangodb/adapters/new-user'
import { byUsername } from './adapters/user-auth/arangodb/adapters/session'
import { argonHashPassword, argonVerifyPassword } from './lib/auth/argon'
import { createMailgunSender } from './lib/emailSender/mailgun/mailgunSender'
import { open, resolve } from './lib/qmino'
import * as edgePorts from './ports/content-graph/edge'
import * as nodePorts from './ports/content-graph/node'
import * as searchPorts from './ports/content-graph/search'
import * as assetPorts from './ports/static-assets/asset'
import * as tmpAssetPorts from './ports/static-assets/temp'
import * as newUserPorts from './ports/user-auth/new-user'
import * as userPorts from './ports/user-auth/user'

export type Config = {
  arangoUrl: string
  mailgunApiKey: string
  mailgunDomain: string
  jwtPrivateKey: string
  jwtExpirationSecs: number
  jwtPublicKey: string
  publicBaseUrl: string
  fsAssetRootFolder: string
  httpPort: number
}
export const startDefaultMoodlenet = async ({
  arangoUrl,
  mailgunApiKey,
  mailgunDomain,
  jwtPrivateKey,
  jwtExpirationSecs,
  jwtPublicKey,
  publicBaseUrl,
  fsAssetRootFolder,
  httpPort,
}: Config) => {
  const emailSender = createMailgunSender({ apiKey: mailgunApiKey, domain: mailgunDomain })
  const contentGraphDatabase = new Database({ url: arangoUrl, databaseName: 'ContentGraph' })
  const userAuthDatabase = new Database({ url: arangoUrl, databaseName: 'UserAuth' })
  const arangoContentGraphAdditionalGQLResolvers = graphqlArangoContentGraphResolvers(contentGraphDatabase)

  const jwtAlg: Algorithm = 'RS256'
  const jwtVerifyOpts: VerifyOptions = {
    algorithms: [jwtAlg],
  }
  const jwtSignOptions: SignOptions = {
    algorithm: jwtAlg,
    expiresIn: jwtExpirationSecs,
  }

  const graphqlApp = createGraphQLApp({
    additionalResolvers: { ...arangoContentGraphAdditionalGQLResolvers },
    jwtPrivateKey,
    jwtSignOptions,
  })
  const assetsApp = createStaticAssetsApp()
  await startMNHttpServer({
    httpPort,
    startServices: { graphql: graphqlApp, assets: assetsApp },
    jwtPublicKey,
    jwtVerifyOpts,
  })

  // open ports

  open(nodePorts.byId, getNodeByIdAdapter(contentGraphDatabase))

  open(searchPorts.byTerm, globalSearch(contentGraphDatabase))

  open(userPorts.getActiveByUsername, {
    ...byUsername(userAuthDatabase),
    verifyPassword: argonVerifyPassword(),
  })

  open(newUserPorts.signUp, {
    ...storeNewSignupRequest(userAuthDatabase),
    publicBaseUrl,
    generateToken: async () => ulid(),
    sendEmail: emailSender.sendEmail,
  })

  open(newUserPorts.confirmSignup, {
    ...activateNewUser(userAuthDatabase),
    hashPassword: (plain: string) => argonHashPassword({ pwd: plain }),
    createNewProfile: async ({ username, env }) => {
      return resolve(
        nodePorts.create<'Profile'>({
          env,
          data: { name: username, summary: '' },
          nodeType: 'Profile',
          key: username,
        }),
      )()
    },
  })

  open(nodePorts.create, createNodeAdapter(contentGraphDatabase))

  open(edgePorts.create, createEdgeAdapter(contentGraphDatabase))
  open(edgePorts.del, deleteEdgeAdapter(contentGraphDatabase))

  //FS asset
  const rootDir = fsAssetRootFolder
  setupFs({ rootDir })
  open(assetPorts.del, delAssetAdapter({ rootDir }))
  open(assetPorts.get, getAssetAdapter({ rootDir }))
  open(tmpAssetPorts.createTemp, createTempAdapter({ rootDir }))
  open(tmpAssetPorts.persistTempAssets, persistTempAssetsAdapter({ rootDir }))
}
