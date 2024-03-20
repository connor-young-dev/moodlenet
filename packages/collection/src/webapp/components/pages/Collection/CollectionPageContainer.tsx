import { Fallback } from '@moodlenet/react-app/ui'
import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import Collection from './Collection.js'
import { useCollectionPageProps } from './CollectionPageHooks.js'

export const CollectionContainer: FC<{ collectionKey: string; editMode: boolean }> = ({
  collectionKey,
  editMode,
}) => {
  const myProps = useCollectionPageProps({ collectionKey })
  const mainLayoutProps = useMainLayoutProps()
  if (myProps === null) {
    return <Fallback mainLayoutProps={mainLayoutProps} />
  } else if (myProps === undefined) return null

  return <Collection key={collectionKey} {...myProps} isEditingAtStart={editMode} />
}
