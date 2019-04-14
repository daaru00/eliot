const deviceCollection = require('../../iot/collection')

/**
 * Intent handler
 *
 * @param {Object} intent
 * @returns {Object}
 */
module.exports = async (intent) => {
  intent.devices = intent.devices || []

  const responses = await Promise.all(intent.devices.map(device => getDeviceState(device.id)))

  const devices = {}
  responses.filter(response => response !== null).forEach((response) => {
    devices[response.id] = response.state
  })

  return {
    devices: devices
  }
}

/**
 * Get device state
 * @param {String} id
 */
async function getDeviceState (id) {
  const device = await deviceCollection.loadSingleDevice('google', id)
  if (device === null) {
    return null
  }
  const state = await device.getState()
  return {
    id,
    state
  }
}
