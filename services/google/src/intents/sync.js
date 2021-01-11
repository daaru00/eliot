const DeviceClient = require('../clients/Device')
const deviceClient = new DeviceClient()

/**
 * Sync intent handler
 *
 * @returns {Object}
 */
module.exports = async () => {
  const devices = await deviceClient.listDevices()

  return {
    agentUserId: process.env.ACCOUNT_ID || 'eliot-user',
    devices: devices
  }
}
