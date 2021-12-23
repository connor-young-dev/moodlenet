import { Type } from './components/pages/NewResource/types'
import { Href } from './elements/link'

export type Organization = {
  name: string
  shortName: string
  subtitle: string
  url: string
  logo: string
  smallLogo: string
  description: string
  color: string
}

export type FollowTag = {
  type: 'subject' | 'collection'
  name: string
  subjectHomeHref: Href
}

export type ResourceType = 'Video' | 'Web Page' | 'Moodle Book'

export const getResourceColorType = (type: Type) => {
  switch (type) {
    case 'Video':
      return '#2c7bcb'
    case 'Web Page':
      return '#cc4fd1'
    default:
      return '#20c184'
  }
}

export type ResourceInfo = {
  type: ResourceType
  title: string
  tags: Pick<FollowTag, 'name'>[]
  image: string
}

export type CollectionInfo = {
  title: string
  image: string
}

export type User = {
  firstName: string
  LastName: string
  avatar: string
  organization: Organization
  background: string
  username: string
  location: string
  site: string
  description: string
  points: number
  kudos: number
  followers: number
  numResources: number
  antiquity: number
  following: FollowTag[]
  resources: ResourceInfo[]
  collections: CollectionInfo[]
}