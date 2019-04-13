const createError = require('http-errors')

/**
 * Client ID validation
 *
 */
module.exports = {
  before: async (handler) => {
    const clientId = handler.event.queryStringParameters.client_id || handler.event.body.client_id

    if (clientId !== process.env.CLIENT_ID) {
      throw createError(401, 'invalid_client')
    }
  }
}
