const DeviceClient = require('../clients/Device')
const deviceClient = new DeviceClient()

/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  const devices = await deviceClient.listDevices()
  const header = directive.header
  header.name = 'Discover.Response'
  return {
    event: {
      header: header,
      payload: {
        endpoints: devices
      }
    }
  }
}
