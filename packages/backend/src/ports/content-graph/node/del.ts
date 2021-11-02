import { GraphNode, GraphNodeIdentifier } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { ns } from '../../../lib/ns/namespace'
import { plug, value } from '../../../lib/plug'
import { Assertions, BV } from '../graph-lang/base'

export type Operators = { delNode: BV<GraphNode> }
export const operators = value<Operators>(ns(module, 'operators'))

export type BRules = (_: Input & { arg: Omit<AdapterArg, 'assertions'> }) => Promise<AdapterArg | null>
export const bRules = plug<BRules>(ns(module, 'b-rules'))

export type AdapterArg = { nodeId: GraphNodeIdentifier; assertions: Assertions }
export type Adapter = (_: AdapterArg) => Promise<boolean>
export const adapter = plug<Adapter>(ns(module, 'adapter'))

export type Input = {
  sessionEnv: SessionEnv
  nodeId: GraphNodeIdentifier
}
export type Port = ({ nodeId: node, sessionEnv }: Input) => Promise<boolean>
export const port = plug<Port>(ns(module, 'delete-node'), async ({ nodeId, sessionEnv }) => {
  const adapterArg = await bRules({ nodeId, sessionEnv, arg: { nodeId } })
  if (!adapterArg) {
    return false
  }

  const result = await adapter(adapterArg)
  return result
})
