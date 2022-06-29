import { FC, useContext } from 'react'
// import { withCtrl } from '../../../../lib/ctrl'
import lib from 'moodlenet-react-app-lib'
import { packagesFake } from '../fakeData'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { StateContext } from '../devModeContextProvider'
import './styles.scss'

export type ModulesProps = {}

const Card = lib.ui.components.atoms.Card
const Switch = lib.ui.components.atoms.Switch

const Modules: FC<ModulesProps> = () => {
  const stateContext = useContext(StateContext)

  const modulesList = packagesFake.map(p => {
    return p.modules.map(
      (module, i) =>
        (!module.mandatory || stateContext.devMode) && (
          <div className="module" key={i}>
            {/* <PackageIcon /> */}
            <div className="name">{module.name}</div>
            <Switch enabled={module.enabled} mandatory={module.mandatory} />
          </div>
        ),
    )
  })
  return (
    <div className="modules">
      <Card>
        <div className="title">Modules</div>
        <div>Manage your modules</div>
      </Card>
      <Card className="modules-list">
        {/* <div className="title">Disabled Modules</div>
        <div>A list of your inactive Modules</div> */}
        <div className="list">{modulesList}</div>
      </Card>
    </div>
  )
}

Modules.displayName = 'Modules'
export default Modules
