const createError = require('http-errors')
const DeviceClient = require('../clients/Device')
const deviceClient = new DeviceClient()

/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  const command = `${directive.header.namespace}.${directive.header.name}`
  const deviceId = directive.endpoint.endpointId
  const scope = directive.endpoint.scope

  const header = directive.header
  let payload = {}
  let context = {}

  const state = await deviceClient.executeCommand(deviceId, command, directive.payload)
  if (state === false) {
    throw createError.BadRequest()
  }

  header.namespace = 'Alexa'
  header.name = 'Response'
  context = {
    properties: state
  }

  return {
    context,
    event: {
      header: header,
      endpoint: {
        scope,
        endpointId: deviceId
      },
      payload: payload
    }
  }
}
