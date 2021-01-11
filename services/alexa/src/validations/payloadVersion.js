const createError = require('http-errors')

/**
 * Namespace validation
 */
module.exports = {
  before: async (handler) => {
    const header = handler.event.directive.header

    if (header.namespace === undefined || header.namespace === null) {
      throw createError.BadRequest('payload_version_not_found')
    }

    if (header.payloadVersion !== '3') {
      throw createError.BadRequest('invalid_payload_version')
    }
  }
}
