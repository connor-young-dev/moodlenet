import { FieldsDataStories } from '@moodlenet/ed-meta/stories'
import type { EdMetaOptionsProps } from '@moodlenet/ed-resource/common'
import type { SimpleEmailUserSettingsProps } from '@moodlenet/simple-email-auth/ui'
import { SimpleEmailUserSettings } from '@moodlenet/simple-email-auth/ui'
import type { UserInterests } from '@moodlenet/web-user/common'
import type { GeneralProps, UserSettingsItem } from '@moodlenet/web-user/ui'
import { General, GeneralMenu } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { useState } from 'react'

export const useUserSettingsGeneralStoryProps = (overrides?: {
  props?: Partial<GeneralProps>
}): GeneralProps => {
  const [subjects, setSubjects] = useState<string[]>([
    FieldsDataStories.SubjectsTextOptionProps[2]!.value,
    FieldsDataStories.SubjectsTextOptionProps[6]!.value,
    FieldsDataStories.SubjectsTextOptionProps[21]!.value,
    // FieldsDataStories.SubjectsTextOptionProps[22]!.value,
  ])
  const interests: UserInterests = {
    subjects: subjects,
    languages: [
      FieldsDataStories.LanguagesTextOptionProps[0]!.value,
      FieldsDataStories.LanguagesTextOptionProps[1]!.value,
      FieldsDataStories.LanguagesTextOptionProps[2]!.value,
    ],
    levels: [FieldsDataStories.LevelTextOptionProps[2]!.value],
    licenses: [FieldsDataStories.LicenseIconTextOptionProps[2]!.value],
    types: [FieldsDataStories.TypeTextOptionProps[1]!.value],
  }

  const edMetaOptions: EdMetaOptionsProps = {
    subjectOptions: FieldsDataStories.SubjectsTextOptionProps,
    languageOptions: FieldsDataStories.LanguagesTextOptionProps,
    levelOptions: FieldsDataStories.LevelTextOptionProps,
    licenseOptions: FieldsDataStories.LicenseIconTextOptionProps,
    monthOptions: FieldsDataStories.MonthTextOptionProps,
    yearOptions: FieldsDataStories.YearsProps,
    typeOptions: FieldsDataStories.TypeTextOptionProps,
  }
  const simpleEmailUserSettingsProps: SimpleEmailUserSettingsProps = {
    data: {
      password: 'mypassword',
    },
    passwordChangedSuccess: false,
    editData: action('edit data'),
  }

  const editInterests = (values: UserInterests) => {
    setSubjects(values.subjects)
  }
  return {
    mainColumnItems: [
      {
        Item: () => <SimpleEmailUserSettings {...simpleEmailUserSettingsProps} />,
        key: 'simple-email-auth',
      },
    ],
    interests: interests,
    edMetaOptions: edMetaOptions,
    editInterests: editInterests,

    // userId: 'john-cake-21321312',
    // updateExtensions: action('Updating extensions'),
    // updateSuccess: true,
    ...overrides?.props,
  }
}

const UserSettingsGeneralItem = () => <General {...useUserSettingsGeneralStoryProps()} />
export const useUserSettingsGeneralElements = (): UserSettingsItem => {
  return {
    Menu: GeneralMenu,
    Content: UserSettingsGeneralItem,
    key: 'content-general',
  }
}
