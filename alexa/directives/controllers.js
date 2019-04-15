const deviceCollection = require('../../iot/collection')

/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  const command = `${directive.header.namespace}.${directive.header.name}`
  const deviceId = directive.endpoint.endpointId

  const header = directive.header
  let payload = {}
  let context = {}

  const device = await deviceCollection.loadSingleDevice('alexa', deviceId)
  if (device === null) {
    header.name = 'ErrorResponse'
    payload = {
      type: 'NO_SUCH_ENDPOINT',
      message: `Device ${command} not found`
    }
  } else {
    const handled = await device.execute(command, directive.payload)
    if (handled === false) {
      header.name = 'ErrorResponse'
      payload = {
        type: 'INVALID_DIRECTIVE',
        message: `Command ${command} not handled for device ${deviceId}`
      }
    } else {
      header.name = 'Response'
      context = {
        properties: await device.getState()
      }
    }
  }

  return {
    context,
    event: {
      header: header,
      endpoint: {
        endpointId: deviceId
      },
      payload: payload
    }
  }
}
