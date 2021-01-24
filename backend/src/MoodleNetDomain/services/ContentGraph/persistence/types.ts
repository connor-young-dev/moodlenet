import { CreateUserPersistence } from '../apis/ContentGraph.User.CreateForNewAccount.api'
import * as GQL from '../ContentGraph.graphql.gen'
export * as Types from '../ContentGraph.graphql.gen'

export const ROOTUserId = 'User/ROOT'

export interface ContentGraphPersistence {
  graphQLTypeResolvers: GQL.Resolvers
  findNode(_: {
    _id: string
    nodeType?: GQL.NodeType | null
  }): Promise<ShallowNode | null>
  createUser: CreateUserPersistence
  // createEdge(_: { edge: CreateEdgeInput }): EdgeMutationPayload
  // createNode(_: {
  //   ctx: Context
  //   nodeType: GQL.NodeType
  //   data: CreateNodeData
  // }): Promise<ShallowNode | null>
  // updateEdge(_: { edge: UpdateEdgeInput }): EdgeMutationPayload
  // updateNode(_: { node: UpdateNodeInput }): NodeMutationPayload
  // deleteGlyph(_: { _id: string }): DeletePayload //config():Promise<Config>
}

export type ShallowNode<N extends GQL.Node = GQL.Node> = Omit<N, '_rel'>
export type ShallowEdge<E extends GQL.Edge = GQL.Edge> = Omit<
  E,
  '___ nothing to omit ___'
>

export type CreateNodeData = Exclude<
  GQL.CreateNodeInput[keyof GQL.CreateNodeInput],
  null
>
// export type QueryNodeShallowPayload = ShallowNode | GQL.QueryNodeError
export type CreateNodeShallowPayload = ShallowNode | GQL.CreateNodeMutationError
export type UpdateNodeShallowPayload = ShallowNode | GQL.UpdateNodeMutationError
export type DeleteNodeShallowPayload = ShallowNode | GQL.DeleteNodeMutationError
// export type QueryEdgeShallowPayload = ShallowNode | GQL.QueryEdgeError
export type CreateEdgeShallowPayload = ShallowNode | GQL.CreateEdgeMutationError
export type UpdateEdgeShallowPayload = ShallowNode | GQL.UpdateEdgeMutationError
export type DeleteEdgeShallowPayload = ShallowNode | GQL.DeleteEdgeMutationError
