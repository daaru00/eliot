const createError = require('http-errors')

/**
 * Response type validation
 *
 */
module.exports = {
  before: async (handler) => {
    const responseType = handler.event.queryStringParameters.response_type

    if (responseType !== 'code') {
      throw createError(400, 'invalid_response_type')
    }
  }
}
