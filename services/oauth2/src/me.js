const createError = require('http-errors')
const middy = require('@middy/core')

/**
 * Middlewares
 */
const httpEventNormalizer = require('@middy/http-event-normalizer')
const httpErrorHandler = require('@middy/http-error-handler')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * Models
 */
const Token = require('./models/Token')

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const requestReceived = async (event) => {
  // Retrieve info from request
  let authorizationToken = event.headers.Authorization
  authorizationToken = authorizationToken || ''
  authorizationToken = authorizationToken.replace(/bearer /ig, '');
  if (authorizationToken.trim().length === 0) {
    throw new createError.Unauthorized('authorization_not_provided')
  }

  // Check access token
  const accessToken = new Token('access-token')
  if (await accessToken.verify(authorizationToken) === false) {
    throw new createError.Unauthorized('invalid_authorization')
  }

  // Return success
  return {
    statusCode: 200
  }
}

/**
 * Middy handler
 */

const handler = middy(requestReceived)
  .use(inputOutLogger())
  .use(httpErrorHandler())
  .use(httpEventNormalizer())

module.exports = { handler }
