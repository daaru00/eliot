const url = require('url')
const createError = require('http-errors')

const ALLOWED_REDIRECT_HOST = [
  'oauth-redirect.googleusercontent.com',
  'alexa.amazon.co.jp',
  'layla.amazon.com',
  'pitangui.amazon.com'
]

/**
 * Redirect URI validation
 *
 */
module.exports = {
  before: async ({ event }) => {
    const redirectUri = new url.URL(event.queryStringParameters.redirect_uri)

    if (redirectUri.protocol !== 'https:' || ALLOWED_REDIRECT_HOST.includes(redirectUri.host) === false) {
      throw new createError.BadRequest('invalid_redirect_uri')
    }
  }
}
