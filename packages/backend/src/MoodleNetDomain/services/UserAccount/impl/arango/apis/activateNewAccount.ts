import { makeId } from '@moodlenet/common/lib/utils/content-graph'
import { call } from '../../../../../../lib/domain/amqp/call'
import { emit } from '../../../../../../lib/domain/amqp/emit'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { getSystemExecutionContext } from '../../../../../types'
import { NodeType } from '../../../../ContentGraph/ContentGraph.graphql.gen'
import { hashPassword, jwtByActiveUserAccountAndUser } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { activateNewAccount } from '../functions/activateNewAccount'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export type T = WrkTypes<
  MoodleNetArangoUserAccountSubDomain,
  'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount'
>

export const ConfirmEmailActivateAccountWorker = ({ persistence }: { persistence: Persistence }) => {
  const worker: T['Worker'] = async ({ flow, token, password, username }) => {
    const hashedPassword = await hashPassword({ pwd: password })
    const userKey = ulidKey()
    const activationResult = await activateNewAccount({
      persistence,
      token,
      username,
      password: hashedPassword,
      userId: makeId(NodeType.User, userKey),
    })
    if (typeof activationResult !== 'string') {
      const user = await call<MoodleNetDomain>()('ContentGraph.Node.Create', flow)<NodeType.User>({
        ctx: getSystemExecutionContext(),
        nodeType: NodeType.User,
        key: userKey,
        data: {
          name: activationResult.username,
          icon: '',
          summary: '',
        },
      })

      if (user.__typename === 'CreateNodeMutationError') {
        //TODO: manage this eventuality (rollback?)
        const errorMsg = `couldn't create user for username:${activationResult.username}, accountId: ${activationResult._id}`
        throw new Error(`${errorMsg} : ${user.type} ${user.details} `)
      }

      emit<MoodleNetArangoUserAccountSubDomain>()(
        'UserAccount.RegisterNewAccount.NewAccountActivated',
        { accountId: activationResult._id, username: activationResult.username },
        flow,
      )

      return { account: activationResult, user }
    } else {
      return activationResult
    }
  }
  return worker
}

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token },
  context,
) => {
  const res = await call<MoodleNetArangoUserAccountSubDomain>()(
    'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount',
    context.flow,
  )({ password, token, username, flow: context.flow })

  console.log('RESP -- UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount ', res)
  if (typeof res === 'string') {
    return {
      __typename: 'CreateSession',
      jwt: null,
      message: res,
    }
  } else {
    const jwt = await jwtByActiveUserAccountAndUser({
      activeUserAccount: res.account,
      user: res.user,
    })

    return {
      __typename: 'CreateSession',
      jwt,
      message: null,
    }
  }
}
