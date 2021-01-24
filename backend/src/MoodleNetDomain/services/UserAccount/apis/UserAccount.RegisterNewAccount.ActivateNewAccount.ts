import { MoodleNet } from '../../..'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { Event } from '../../../../lib/domain/event/types'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'
import { ActiveUserAccount, Messages } from '../persistence/types'
import { SessionAuth } from '../UserAccount'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers, Session } from '../UserAccount.graphql.gen'
import { hashPassword } from '../UserAccount.helpers'

export type NewAccountActivatedEvent = Event<{
  accountId: string
  username: string
}>

export type ActivateNewAccountPersistence = (_: {
  token: string
  username: string
  password: string
}) => Promise<
  ActiveUserAccount | Messages.NotFound | Messages.UsernameNotAvailable
>

export type ConfirmEmailActivateAccountApi = Api<
  { token: string; password: string; username: string },
  SessionAuth
>

export const ConfirmEmailActivateAccountApiHandler = async () => {
  const { activateNewAccount } = await getAccountPersistence()
  const handler: RespondApiHandler<ConfirmEmailActivateAccountApi> = async ({
    flow,
    req: { token, password, username },
  }) => {
    const hashedPassword = await hashPassword({ pwd: password })
    const maybeAccount = await activateNewAccount({
      token,
      username,
      password: hashedPassword,
    })
    if (typeof maybeAccount === 'string') {
      return { userAccount: null }
    } else {
      const { username, _id } = maybeAccount
      MoodleNet.emitEvent({
        event: 'UserAccount.RegisterNewAccount.NewAccountActivated',
        flow,
        payload: { accountId: _id, username },
      })

      return { userAccount: maybeAccount }
    }
  }
  return handler
}

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token }
) => {
  const { res } = await graphQLRequestApiCaller({
    api: 'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount',
    req: { password, token, username },
  })
  if (res.___ERROR) {
    return {
      __typename: 'Session',
      message: res.___ERROR.msg,
      auth: null,
    }
  } else if (!res.userAccount) {
    const session: Session = {
      __typename: 'Session',
      auth: null,
      message: 'not found',
    }
    return session
  } else {
    const {
      userAccount: { changeEmailRequest, username, email, _id },
    } = res
    const session: Session = {
      __typename: 'Session',
      auth: {
        __typename: 'Auth',
        sessionAccount: {
          __typename: 'SessionAccount',
          accountId: _id,
          changeEmailRequest: changeEmailRequest?.email || null,
          email,
          username,
        },
      },
      message: null,
    }
    return session
  }
}
