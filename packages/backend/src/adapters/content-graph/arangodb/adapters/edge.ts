import { edgeTypeFromId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { getOneResult } from '../../../../lib/helpers/arango'
import { CreateAdapter, DeleteAdapter } from '../../../../ports/content-graph/edge'
import { createEdgeQ } from '../functions/createEdge'
import { deleteEdgeQ } from '../functions/deleteEdge'
import { DocumentEdgeByType } from '../functions/types'

export const createEdgeAdapter = (db: Database): CreateAdapter => ({
  storeEdge: async ({ data, edgeType, creatorProfileId, from, to }) => {
    const q = createEdgeQ({ creatorProfileId, data, edgeType, from, to })
    return getOneResult(q, db)
  },
})

export const deleteEdgeAdapter = (db: Database): DeleteAdapter => ({
  deleteEdge: async ({ edgeType, deleterProfileId, edgeId }) => {
    if (edgeType !== edgeTypeFromId(edgeId)) {
      return 'NotFound'
    }
    const q = deleteEdgeQ({ deleterProfileId, edgeId, edgeType })
    const result = (await getOneResult(q, db)) as DocumentEdgeByType<typeof edgeType> //NOTE: must infer generic type from argument, as cannot redeclare generic on function signature
    // NOTE: if result is `any` (not strictly typed),
    //       the whole function looses typing,
    //       allowing to return anything (... since later it returns `result:any`)

    if (!result) {
      return 'NotFound'
    }

    return result
  },
})
