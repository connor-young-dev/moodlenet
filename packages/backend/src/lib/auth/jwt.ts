import JWT from 'jsonwebtoken'
import { ActiveUser } from '../../adapters/user-auth/arangodb/types'
import { SessionEnv } from './types'

export const INVALID_TOKEN = Symbol('INVALID_TOKEN')
export type INVALID_TOKEN = typeof INVALID_TOKEN

export type JWTTokenVerification = SessionEnv | INVALID_TOKEN

export const verifyJwt = ({
  jwtPublicKey,
  jwtVerifyOpts,
  token,
}: {
  token: string
  jwtPublicKey: string
  jwtVerifyOpts: JWT.VerifyOptions
}): JWTTokenVerification => {
  try {
    const sessionEnv = JWT.verify(String(token), jwtPublicKey, jwtVerifyOpts)
    if (typeof sessionEnv !== 'object') {
      return INVALID_TOKEN
    }
    /* FIXME: implement proper checks */
    return sessionEnv as SessionEnv
  } catch {
    return INVALID_TOKEN
  }
}

export type JwtPrivateKey = string
export const signJwtActiveUser = ({
  jwtSignOptions,
  jwtPrivateKey,
  user,
}: {
  jwtPrivateKey: JwtPrivateKey
  jwtSignOptions: JWT.SignOptions
  user: ActiveUser
}) => signJwtAny({ jwtSignOptions, jwtPrivateKey, payload: getSessioncEnvByActiveUser(user) })

export const getSessioncEnvByActiveUser = (user: ActiveUser): SessionEnv => ({
  user: {
    name: user.username,
    role: user.role,
  },
})

export const signJwtAny = ({
  jwtSignOptions,
  jwtPrivateKey,
  payload,
}: {
  jwtPrivateKey: JwtPrivateKey
  jwtSignOptions: JWT.SignOptions
  payload: string | Object | Buffer
}) => JWT.sign(payload, jwtPrivateKey, jwtSignOptions) /*  {
    algorithm: 'RS256',
    expiresIn: jwtExpirationSecs,
  }) */
