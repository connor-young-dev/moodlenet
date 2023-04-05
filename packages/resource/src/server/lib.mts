import { RpcFile } from '@moodlenet/core'
import {
  create,
  delEntity,
  EntityAccess,
  getEntity,
  GetEntityOpts,
  Patch,
  patchEntity,
  QueryEntitiesCustomProject,
} from '@moodlenet/system-entities/server'
import { Resource, resourceFiles } from './init.mjs'
import { shell } from './shell.mjs'
import { ResourceDataType, ResourceEntityDoc } from './types.mjs'

export async function createResource(resourceData: ResourceDataType) {
  const newResource = await shell.call(create)(Resource.entityClass, resourceData)

  return newResource
}

export async function getResource<
  Project extends QueryEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(_key: string, opts?: GetEntityOpts<Project, ProjectAccess>) {
  const foundResource = await shell.call(getEntity)(Resource.entityClass, _key, {
    projectAccess: opts?.projectAccess,
    project: opts?.project,
  })
  return foundResource
}

export async function patchResource(_key: string, patch: Patch<ResourceEntityDoc>) {
  const patchResult = await shell.call(patchEntity)(Resource.entityClass, _key, patch)
  return patchResult
}

export async function delResource(_key: string) {
  const patchResult = await shell.call(delEntity)(Resource.entityClass, _key)
  return patchResult
}

export function getImageLogicalFilename(resourceKey: string) {
  return `image/${resourceKey}`
}

export async function storeResourceFile(resourceKey: string, imageRpcFile: RpcFile) {
  const resourceLogicalFilename = getResourceLogicalFilename(resourceKey)

  const fsItem = await resourceFiles.store(resourceLogicalFilename, imageRpcFile)

  return fsItem
}

export function getResourceLogicalFilename(resourceKey: string) {
  return `resource-file/${resourceKey}`
}

export const RESOURCE_DOWNLOAD_ENDPOINT = 'dl/resource/:_key/:filename'
export function getResourceFileUrl({ rpcFile, _key }: { _key: string; rpcFile: RpcFile }) {
  return RESOURCE_DOWNLOAD_ENDPOINT.replace(':_key', _key).replace(':filename', rpcFile.name)
}