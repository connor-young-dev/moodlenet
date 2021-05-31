import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { ActiveUser } from '../../adapters/user-auth/arangodb/types'
import { DefaultConfig } from '../../adapters/user-auth/emailTemplates'
import { makeEnv } from '../../lib/auth/env'
import { SessionEnv } from '../../lib/auth/types'
import { fillEmailTemplate } from '../../lib/emailSender/helpers'
import { EmailAddr, EmailObj } from '../../lib/emailSender/types'
import { QMCommand, QMModule } from '../../lib/qmino'

export type SignupIssue = 'email not available'
export type SignUpAdapter = {
  storeNewSignupRequest(_: { email: string; token: string }): Promise<void | SignupIssue>
  generateToken(): Promise<string>
  sendEmail(_: EmailObj): Promise<unknown>
  publicBaseUrl: string
}
export const signUp = QMCommand(
  ({ email }: { email: EmailAddr }) =>
    async ({ storeNewSignupRequest, generateToken, sendEmail, publicBaseUrl }: SignUpAdapter) => {
      const token = await generateToken()
      const insertIssue = await storeNewSignupRequest({ email, token })
      if (insertIssue) {
        return insertIssue
      }
      const emailObj = fillEmailTemplate({
        template: DefaultConfig.newUserRequestEmail,
        to: email,
        vars: {
          email,
          link: `${publicBaseUrl}${webappPath<Routes.ActivateNewUser>('/activate-new-user/:token', {
            token,
          })}`,
        },
      })
      sendEmail(emailObj)
      return
    },
)

export type NewUserConfirmAdapter = {
  activateUser(_: {
    token: string
    password: string
    username: string
  }): Promise<ActiveUser | 'username not available' | 'not found'>
  hashPassword(pwd: string): Promise<string>

  createNewProfile(_: { username: string; env: SessionEnv }): Promise<unknown>
}
type ConfirmSignup = { token: string; password: string; username: string }
export const confirmSignup = QMCommand(
  ({ token, password: plainPwd, username }: ConfirmSignup) =>
    async ({ activateUser, hashPassword, createNewProfile }: NewUserConfirmAdapter) => {
      const pwdHash = await hashPassword(plainPwd)

      const activateResult = await activateUser({ password: pwdHash, token, username })

      if (typeof activateResult === 'string') {
        return activateResult // error
      }

      const env = makeEnv({ user: { name: activateResult.username, role: activateResult.role } })
      createNewProfile({ username, env })

      return activateResult
    },
)

QMModule(module)
