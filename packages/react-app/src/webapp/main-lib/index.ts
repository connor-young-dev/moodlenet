import * as ui from '../ui'
import defaultAvatar from '../ui/assets/img/default-avatar.svg'
import { ContentGraphContext } from '../ui/components/pages/ContentGraph/ContentGraphProvider'
import * as auth from './auth'
import priHttp from './pri-http'

export type MainLib = typeof lib

const lib = {
  priHttp,
  ui,
  auth,
  contentGraph: { Context: ContentGraphContext },
  defaultAvatar,
}

export default lib
