import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Profile } from '../../sys-entities.mjs'

const cursor = await sysEntitiesDB.query(
  `FOR profile IN @@ProfileCollection
    UPDATE profile WITH { 
        profileInterests: {
          subjects: [],
          licenses: [],
          levels: [],
          languages: []
        }  
      } IN @@ProfileCollection
    RETURN null`,
  { '@ProfileCollection': Profile.collection.name },
)
cursor.kill()

export default 2
