const createError = require('http-errors')

/**
 * Response type validation
 *
 */
module.exports = {
  before: async (handler) => {
    handler.event.queryStringParameters = handler.event.queryStringParameters || {}
    const responseType = handler.event.queryStringParameters.response_type

    if (responseType !== 'code') {
      throw new createError.BadRequest('invalid_response_type')
    }
  }
}
