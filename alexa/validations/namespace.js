const createError = require('http-errors')

const SUPPORTED_NAMESPACE = [
  'Alexa.Authorization',
  'Alexa.Discovery',
  'Alexa.PowerController',
  'Alexa'
]

/**
 * Namespace validation
 */
module.exports = {
  before: async (handler) => {
    const header = handler.event.directive.header

    if (header.namespace === undefined || header.namespace === null) {
      throw createError.BadRequest()
    }

    if (SUPPORTED_NAMESPACE.includes(header.namespace) === false) {
      throw createError.NotImplemented()
    }
  }
}
