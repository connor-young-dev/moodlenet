import { Fallback } from '@moodlenet/react-app/ui'
import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { ProvideCurrentResourceContext } from '../../../CurrentResourceContext.js'
import ResourcePage from './Resource.js'
import { useResourcePageProps } from './ResourcePageHooks.js'

export const ResourcePageContainer: FC<{ resourceKey: string; editMode: boolean }> = ({
  resourceKey,
  editMode,
}) => {
  const panelProps = useResourcePageProps({ resourceKey })
  const mainLayoutProps = useMainLayoutProps()
  if (panelProps === null) {
    return <Fallback mainLayoutProps={mainLayoutProps} />
  } else if (panelProps === undefined) {
    return null
  }

  return (
    <ProvideCurrentResourceContext _key={resourceKey} key={resourceKey}>
      <ResourcePage {...panelProps} key={resourceKey} isEditingAtStart={editMode} />
    </ProvideCurrentResourceContext>
  )
}
