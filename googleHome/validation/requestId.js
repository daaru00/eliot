const createError = require('http-errors')

/**
 * Request id validation
 *
 */
module.exports = {
  before: async (handler) => {
    const body = handler.event.body || {}
    const requestId = body.requestId

    if (requestId === undefined || requestId === null || requestId.trim().length === 0) {
      throw createError(400, 'invalid_request_id')
    }

    handler.event.requestId = requestId
  }
}
