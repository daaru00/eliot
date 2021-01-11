const createError = require('http-errors')

/**
 * Response type validation
 *
 */
module.exports = {
  before: async ({ event }) => {
    event.queryStringParameters = event.queryStringParameters || {}
    const responseType = event.queryStringParameters.response_type

    if (responseType !== 'code') {
      throw new createError.BadRequest('invalid_response_type')
    }
  }
}
