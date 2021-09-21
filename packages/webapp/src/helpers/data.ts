import { AssetRef } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { getAssetRefUrl, UploadType } from '@moodlenet/common/lib/staticAsset/lib'
import { useMemo } from 'react'
import { Tuple } from 'tuple-type'
import { STATIC_ASSET_BASE } from '../constants'
import { useSession } from '../context/Global/Session'
import { AssetRefInput } from '../graphql/pub.graphql.link'

type UIAssetInput = {
  data: File | null | undefined
  type: UploadType
}

export const mapUIAssetInputToAssetRefInput = (apiKey: string) => async (input: UIAssetInput) => {
  const { data, type } = input
  const assetRefInput: AssetRefInput | Promise<AssetRefInput> =
    data === undefined
      ? { type: 'NoChange', location: '' }
      : data === null
      ? { type: 'NoAsset', location: '' }
      : uploadTempFile(apiKey)(type, data).then<AssetRefInput>(location => ({
          location,
          type: 'TmpUpload',
        }))
  return assetRefInput
}

export const mapTupleUIAssetInputToAssetRefInput = (apiKey: string) => async <N extends number>(
  inputs: Tuple<UIAssetInput, N>,
): Promise<Tuple<AssetRefInput, N>> =>
  Promise.all(inputs.map(mapUIAssetInputToAssetRefInput(apiKey))) as Promise<Tuple<AssetRefInput, N>>

export const useUploadTempFile = () => {
  const { lastSessionJwt } = useSession()
  return useMemo(() => {
    return lastSessionJwt ? uploadTempFile(lastSessionJwt) : () => Promise.reject('no jwt key available')
  }, [lastSessionJwt])
}
export const uploadTempFile = (apiKey: string) => async (assetType: UploadType, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', assetType)
  const url = `${STATIC_ASSET_BASE}/upload-temp`
  return (
    fetch(url, {
      method: 'POST',
      body: formData as any,
      headers: {
        //@ts-ignore
        bearer: apiKey,
        // 'Content-Type': 'multipart/form-data',
      },
    })
      // .catch(e => (console.error(e), Promise.reject(e)))
      .then(resp => (resp.status === 200 ? resp.text() : Promise.reject('unknown')))
  )
}

export const useMapTupleUIAssetInputToAssetRefInput = () => {
  const { lastSessionJwt } = useSession()
  return useMemo(() => lastSessionJwt && mapTupleUIAssetInputToAssetRefInput(lastSessionJwt), [lastSessionJwt])
}

export const hasNoValue = (_: any): _ is null | undefined | void => [null, undefined].includes(_)

export const getJustAssetRefUrl = (assetRef: AssetRef): string =>
  getAssetRefUrl({ assetRef, baseStaticAssetUrl: STATIC_ASSET_BASE })

export const getMaybeAssetRefUrl = (assetRef: AssetRef | null | undefined): null | string =>
  assetRef ? getJustAssetRefUrl(assetRef) : null

export const getMaybeAssetRefUrlOrDefaultImage = (
  assetRef: AssetRef | null | undefined,
  id: string,
  type: 'icon' | 'image' | 'avatar',
): string =>
  getMaybeAssetRefUrl(assetRef) ??
  `https://picsum.photos/seed/${id.replaceAll('/', '_')}_${type}_/${type === 'icon' ? '200/200' : '800/600'}`
