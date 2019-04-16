const createError = require('http-errors')
const deviceCollection = require('../../iot/collection')

/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  const deviceId = directive.endpoint.endpointId

  const device = await deviceCollection.loadSingleDevice('alexa', deviceId)
  if (device === null) {
    throw createError.NotFound()
  }
  const state = await device.getState()

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
