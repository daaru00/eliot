const url = require('url')
const createError = require('http-errors')

const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID
const GOOGLE_REDIRECT_HOST = 'oauth-redirect.googleusercontent.com'

/**
 * Google project ID validation
 *
 */
module.exports = {
  before: async ({ event }) => {
    const redirectUri = new url.URL(event.queryStringParameters.redirect_uri)

    if (GOOGLE_PROJECT_ID === undefined || GOOGLE_PROJECT_ID === '') {
      return
    }

    if (GOOGLE_REDIRECT_HOST !== redirectUri.host) {
      return
    }

    const pathParts = redirectUri.pathname.split('/').filter(part => part.trim() !== '')
    if (pathParts.pop() !== GOOGLE_PROJECT_ID) {
      throw new createError.BadRequest('invalid_google_project')
    }
  }
}
