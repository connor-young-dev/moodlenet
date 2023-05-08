import type { CollectionCardProps } from '@moodlenet/collection/ui'
import { collectionsCardFactory } from '@moodlenet/collection/ui'
import { getRandomSortedArrayElements } from '@moodlenet/component-library'
import type { PartialDeep } from 'type-fest'
import { getCollectionCardStoryProps } from './CollectionCard.stories.js'

export const getCollectionsCardStoryProps = (
  amount = 8,
  overrides?: PartialDeep<CollectionCardProps>,
): CollectionCardProps[] => {
  return getRandomSortedArrayElements(collectionsCardFactory, amount).map(collection => {
    return getCollectionCardStoryProps({ ...collection, ...overrides })
  })
}