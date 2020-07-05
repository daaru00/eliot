const createError = require('http-errors')

/**
 * Client secret validation
 *
 */
module.exports = {
  before: async (handler) => {
    handler.event.body = handler.event.body || {}
    const clientSecret = handler.event.body.client_secret

    if (clientSecret !== process.env.CLIENT_SECRET) {
      throw new createError.Unauthorized('invalid_client_secret')
    }
  }
}
