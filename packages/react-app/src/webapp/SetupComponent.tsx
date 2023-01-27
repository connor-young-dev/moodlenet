import { FC, PropsWithChildren, useContext } from 'react'
import { MainContext } from './context/MainContext.mjs'
import { avatarmenuItemReg } from './ui/components/organisms/HeaderProfile/HeaderProfile.js'
import { UsersContainer } from './ui/components/organisms/Roles/UsersContainer.js'
import { AuthCtx, SettingsSectionItem } from './web-lib.mjs'

const settingsSectionItem: SettingsSectionItem = {
  Content: UsersContainer,
  Menu: () => <span>User Types </span>,
}

const SetupComponent: FC<PropsWithChildren> = ({ children }) => {
  const { clientSessionData } = useContext(AuthCtx)
  const { reg } = useContext(MainContext)
  reg.avatarMenuItems.useRegister(avatarmenuItemReg, {
    condition: !!clientSessionData?.myUserNode, // TODO: should have chance to check myUserNode against GlyphDescriptor Profile !
  })
  reg.settingsSections.useRegister(settingsSectionItem)

  return <>{children}</>
}
export default SetupComponent