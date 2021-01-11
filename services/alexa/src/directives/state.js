const createError = require('http-errors')
const DeviceClient = require('../clients/Device')
const deviceClient = new DeviceClient()

/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  const deviceId = directive.endpoint.endpointId
  const device = await deviceClient.getDevice(deviceId)
  if (device === null) {
    throw createError.NotFound()
  }
  const state = device.state

  const header = directive.header
  header.name = 'StateReport'

  return {
    event: {
      header: header,
      endpoint: {
        endpointId: deviceId,
        cookie: {}
      },
      payload: {}
    },
    context: {
      properties: state
    }
  }
}
