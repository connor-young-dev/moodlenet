import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import {
  BOOKMARKS_PAGE_ROUTE_PATH,
  FOLLOWING_PAGE_ROUTE_PATH,
  LOGIN_PAGE_ROUTE_BASE_PATH,
  LOGIN_ROOT_PAGE_ROUTE_SUB_PATH,
  PROFILE_HOME_PAGE_ROUTE_PATH,
  SETTINGS_PAGE_ROUTE_PATH,
  SIGNUP_PAGE_ROUTE_BASE_PATH,
} from '../../common/webapp-routes.mjs'
import LoginPanelContainer from './page/access/LoginPageContainer.js'
import { RootLoginContainer } from './page/access/RootLoginContainer.js'
import { SignUpContainer } from './page/access/SignupContainer.js'
import { BookmarksPageContainer } from './page/bookmarks/BookmarksPageContainer.js'
import { FollowingPageContainer } from './page/following/FollowingPageContainer.js'
import { ProfilePageRoute } from './page/profile/ProfilePageRoute.js'
import { UserSettingsRoute } from './page/settings/UserSettingsRoute.js'

export const pkgRoutes: PkgRoutes = {
  routes: (
    <>
      <Route path={SETTINGS_PAGE_ROUTE_PATH} element={<UserSettingsRoute />} />
      <Route path={BOOKMARKS_PAGE_ROUTE_PATH} element={<BookmarksPageContainer />} />
      <Route path={FOLLOWING_PAGE_ROUTE_PATH} element={<FollowingPageContainer />} />
      <Route path={LOGIN_PAGE_ROUTE_BASE_PATH}>
        <Route index element={<LoginPanelContainer />} />
        <Route path={LOGIN_ROOT_PAGE_ROUTE_SUB_PATH} element={<RootLoginContainer />} />
      </Route>
      <Route path={SIGNUP_PAGE_ROUTE_BASE_PATH}>
        <Route index element={<SignUpContainer />} />
      </Route>
      <Route path={PROFILE_HOME_PAGE_ROUTE_PATH} element={<ProfilePageRoute />} />
    </>
  ),
}
