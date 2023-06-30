import kvStoreFactory from '@moodlenet/key-value-store/server'
import type { AppearanceData } from '../../common/types.mjs'
import { shell } from '../shell.mjs'

export type KeyValueData = {
  'persistence-version': { v: number }
  'appearanceData': AppearanceData
  'configs': {
    webImageSize: [number, number]
    webIconSize: [number, number]
  }
  'build-info':
    | {
        status: 'built'
        lastBuild: string
        pluginsHash: string
      }
    | {
        status: 'building'
        pluginsHash: string
      }
}
export const kvStore = await kvStoreFactory<KeyValueData>(shell)
