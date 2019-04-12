const url = require('url')
const createError = require('http-errors')

/**
 * Google project ID validation
 *
 */
module.exports = {
  before: async (handler) => {
    const redirectUri = new url.URL(handler.event.queryStringParameters.redirect_uri)

    if (process.env.GOOGLE_PROJECT_ID !== undefined && redirectUri.pathname.split('/').pop() !== process.env.GOOGLE_PROJECT_ID) {
      throw createError(400, 'invalid_project')
    }
  }
}
