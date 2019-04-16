const createError = require('http-errors')
const deviceCollection = require('../../iot/collection')

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

  const device = await deviceCollection.loadSingleDevice('alexa', deviceId)
  if (device === null) {
    throw createError.NotFound()
  } else {
    const handled = await device.execute(command, directive.payload)
    if (handled === false) {
      throw createError.BadRequest()
    } else {
      header.namespace = 'Alexa'
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
        scope,
        endpointId: deviceId
      },
      payload: payload
    }
  }
}
