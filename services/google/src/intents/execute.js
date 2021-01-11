const DeviceClient = require('../clients/Device')
const deviceClient = new DeviceClient()

/**
 * Execute intent handler
 *
 * @param {Object} payload
 * @returns {Object}
 */
module.exports = async (payload) => {
  const commandsToExecute = []
  payload.commands.forEach(command => {
    command.devices.forEach(device => {
      command.execution.forEach(execution => {
        commandsToExecute.push({
          deviceId: device.id,
          command: execution.command,
          payload: execution.params
        })
      })
    })
  })

  return {
    commands: await Promise.all(
      commandsToExecute.map(command => executeCommandOnDevice(command))
    )
  }
}

/**
 * Execute command on single device
 *
 * @param {Object} command
 */
async function executeCommandOnDevice ({ deviceId, command, payload }) {
  let state = {}
  try {
    state = await deviceClient.executeCommand(deviceId, command, payload)
  } catch (error) {
    return {
      ids: [deviceId],
      status: 'ERROR',
      errorCode: error.message
    }
  }
  
  return {
    ids: [deviceId],
    status: 'SUCCESS',
    states: state
  }
}
