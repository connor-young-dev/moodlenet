import assert from 'assert'
import { fork } from 'child_process'

let shutting_down = false
let rebooting = false
let ignitor_process = null

process.on('message', cmd => {
  bannerLog(`[${cmd}] COMMAND`)
  switch (cmd) {
    case 'reboot': {
      reboot()
      return
    }
    case 'shutdown': {
      shutdownServices()
      return
    }
  }
})

process.on('SIGINT', async () => {
  bannerLog('SHUTTING DOWN PROCESS')
  await shutdownServices()
  bannerLog('PROCESS SHUT DOWN')
  process.exit()
})
await boot()
process.send?.('ready')

async function reboot() {
  if (shutting_down) {
    return
  }
  rebooting = true
  await shutdownServices()
  await boot()
  rebooting = false
  return
}

async function boot() {
  return new Promise(resolve => {
    bannerLog(`${rebooting ? 'RE' : ''}BOOTING SERVICES`)

    // ignitor_process = fork('ignitor.mjs', { execPath: 'npx', execArgv: ['-y', 'node-dev'] })
    ignitor_process = fork('ignitor.mjs')
    ignitor_process.once('exit', sig => !rebooting && process.exit(sig))
    ignitor_process.on('message', function readyHandler(msg) {
      if (msg !== 'ready') {
        return
      }
      ignitor_process.off('message', readyHandler)
      resolve()
    })
  })
}

async function shutdownServices() {
  assert(ignitor_process, 'no process to shutdown')

  if (shutting_down) {
    console.info('already shutting down ....')
    return
  }

  shutting_down = true
  bannerLog(`SHUTTING DOWN SERVICES`)

  return new Promise(resolve => {
    ignitor_process.once('exit', () => {
      bannerLog(`SERVICES SHUT DOWN`)

      ignitor_process = null
      shutting_down = false

      resolve()
    })
    ignitor_process.kill()
  })
}

function bannerLog(msg) {
  const stars = '*'.repeat(msg.length)
  console.info(`

${stars}
${msg}  
${stars}
  
  `)
}
