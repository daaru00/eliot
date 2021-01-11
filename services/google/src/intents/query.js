const DeviceClient = require('../clients/Device')
const deviceClient = new DeviceClient()

/**
 * Query intent handler
 *
 * @param {Object} payload
 * @returns {Object}
 */
module.exports = async (payload) => {
  // Retrieve devices
  const devices = await Promise.all(payload.devices.map(device => deviceClient.getDevice(device.id)))

  // Build response payload
  const responsePayload = {
    devices: {}
  }
  for (const device of devices) {
    responsePayload.devices[device.description.id] = device.state
  }

  // Return response payload
  return responsePayload
}
