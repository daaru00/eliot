const url = require('url')
const createError = require('http-errors')

/**
 * Redirect URI validation
 *
 */
module.exports = {
  before: async (handler) => {
    const redirectUri = new url.URL(handler.event.queryStringParameters.redirect_uri)

    if (redirectUri.protocol !== 'https:' || redirectUri.host !== 'oauth-redirect.googleusercontent.com') {
      throw createError(400, 'invalid_redirect_uri')
    }
  }
}
