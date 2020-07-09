const url = require('url')
const createError = require('http-errors')

const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID
const GOOGLE_REDIRECT_HOST = 'oauth-redirect.googleusercontent.com'

/**
 * Google project ID validation
 *
 */
module.exports = {
  before: async (handler) => {
    handler.event.queryStringParameters = handler.event.queryStringParameters || {}
    const redirectUri = new url.URL(handler.event.queryStringParameters.redirect_uri)

    if (GOOGLE_PROJECT_ID === undefined || GOOGLE_PROJECT_ID === '') {
      return
    }

    if (GOOGLE_REDIRECT_HOST !== redirectUri.host) {
      return
    }

    if (redirectUri.pathname.split('/').pop() !== GOOGLE_PROJECT_ID) {
      throw new createError.BadRequest('invalid_project')
    }
  }
}
