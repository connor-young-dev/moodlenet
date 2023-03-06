import { getRandomSortedArrayElements } from '@moodlenet/component-library'
import { PartialDeep } from 'type-fest'
import { collectionsCardFactory } from '../../../helpers/factories.js'
import { CollectionCardProps } from './CollectionCard.js'
import { getCollectionCardStoryProps } from './CollectionCard.stories.js'

export const getCollectionsCardStoryProps = (
  amount = 8,
  overrides?: PartialDeep<CollectionCardProps>,
): CollectionCardProps[] => {
  return getRandomSortedArrayElements(collectionsCardFactory, amount).map(collection => {
    console.log('collection', collection)
    // const updatedOverrides = overrideDeep<CollectionCardProps>(collection, { ...overrides })
    console.log('updatedOverrides', getCollectionCardStoryProps({ ...collection, ...overrides }))
    return getCollectionCardStoryProps({ ...collection, ...overrides })
  })
}