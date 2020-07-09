const createError = require('http-errors')

/**
 * Client ID validation
 *
 */
module.exports = {
  before: async (handler) => {
    handler.event.queryStringParameters = handler.event.queryStringParameters || {}
    handler.event.body = handler.event.body || {}
    const clientId = handler.event.queryStringParameters.client_id || handler.event.body.client_id

    if (clientId !== process.env.CLIENT_ID) {
      throw new createError.Unauthorized('invalid_client_id')
    }
  }
}
