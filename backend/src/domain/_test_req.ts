import { callSync } from '../lib/domain3/amqp'
import { point } from '../lib/domain3/domain'
import { MoodleNetDomain } from './MoodleNetDomain'

const acc = point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')
export const accReg = acc('wf')('RegisterNewAccount')
export const start = (n: number) =>
  Array(n)
    .fill(n)
    .map(async (_, index) => {
      const res = await callSync({
        pointer: accReg('start'),
        payload: {
          email: `${index}zz`,
          username: 'ww',
        },
      })
      l(res, index)
    })

const __LOG = true
const l = (...args: any[]) =>
  __LOG &&
  console.log(
    'CLIENT ----------\n',
    ...args.reduce((r, _) => [...r, _, '\n'], []),
    '-----------\n\n'
  )
