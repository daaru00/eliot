const createError = require('http-errors')

/**
 * Client secret validation
 *
 */
module.exports = {
  before: async (handler) => {
    const clientSecret = handler.event.body.client_secret

    if (clientSecret !== process.env.CLIENT_SECRET) {
      throw createError(401, 'invalid_client')
    }
  }
}
