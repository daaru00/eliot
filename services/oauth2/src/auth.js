const url = require('url')
const querystring = require('querystring')
const middy = require('@middy/core')

/**
 * Middlewares
 */
const httpEventNormalizer = require('@middy/http-event-normalizer')
const httpErrorHandler = require('@middy/http-error-handler')
const ssm = require('@middy/ssm')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * Models and clients
 */
const Token = require('./models/Token')
const eventEmitter = require('./clients/Event')

/**
 * Validations
 */
const validation = {
  clientId: require('./validations/clientId'),
  redirectUri: require('./validations/redirectUri'),
  googleProjectId: require('./validations/googleProjectId'),
  responseTypeCode: require('./validations/responseTypeCode')
}

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const requestReceived = async (event) => {
  // Retrieve info from request
  const redirectUri = new url.URL(event.queryStringParameters.redirect_uri)
  const state = event.queryStringParameters.state

  // Generate auth code
  const authCode = new Token('auth-code')
  authCode.generate({
    length: 7, 
    ttl: 1800 // 30 minutes
  })
  await authCode.save()

  // Build query parameters on redirect uri
  redirectUri.search =  querystring.stringify({
    code: authCode.value,
    state
  })

  // Emit event
  await eventEmitter.emitAuthCodeRequested()

  // Return redirect
  return {
    statusCode: 302,
    headers: {
      'Location': redirectUri.href
    }
  }
}

/**
 * Error handler
 * 
 * @param {Object} handler
 */
const errorRaised = (handler, next) => {
  console.log('handler.error', handler.error);

  // Emit event
  eventEmitter.emitAuthCodeError(handler.error)
    .then(() => {
      // Event bubbling
      next(handler.error)
    })
}

/**
 * Middy handler
 */
const handler = middy(requestReceived)
  .use(inputOutLogger())
  .onError(errorRaised)
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(ssm({
    awsSdkOptions: {
      logger: console,
    },
    cache: true,
    names: {
      'CLIENT_ID': process.env.CLIENT_ID_PARAMETER_NAME
    }
  }))
  .use(validation.clientId)
  .use(validation.redirectUri)
  .use(validation.googleProjectId)
  .use(validation.responseTypeCode)

module.exports = { handler }
