const createError = require('http-errors')
const middy = require('@middy/core')

/**
 * Middlewares
 */
const httpEventNormalizer = require('@middy/http-event-normalizer')
const httpErrorHandler = require('@middy/http-error-handler')
const httpHeaderNormalizer = require('@middy/http-header-normalizer')
const urlEncodeBodyParser = require('@middy/http-urlencode-body-parser')
const jsonBodyParser = require('@middy/http-json-body-parser')
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
  clientSecret: require('./validations/clientSecret'),
  grantType: require('./validations/grantType')
}

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const requestReceived = async (event) => {
  const body = event.body
  const grantType = body.grant_type

  const authCode = new Token('auth-code')
  const refreshToken = new Token('refresh-token')
  const accessToken = new Token('access-token')

  if (grantType === 'authorization_code') {
    const providedCode = body.code

    if (providedCode === undefined || providedCode.length !== 7 || await authCode.verify(providedCode) === false) {
      throw new createError.BadRequest('invalid_code')
    }

    refreshToken.generate({
      length: 40
    })
    await refreshToken.save()

    accessToken.generate({
      length: 40,
      ttl: 2592000 // 30 days
    })
    await accessToken.save()

    // Delete old auth token
    await authCode.delete()

    // Emit event
    await eventEmitter.emitAuthCodeExchanged()
  } 
  else if (grantType === 'refresh_token') 
  {
    const refreshTokenProvided = body.refresh_token

    if (refreshTokenProvided === undefined || refreshTokenProvided.length !== 40) {
      throw new createError.BadRequest('invalid_refresh')
    }

    if (await refreshToken.verify(refreshTokenProvided, true) === false) {
      throw new createError.BadRequest('invalid_refresh')
    }

    accessToken.generate({
      length: 40,
      ttl: 2592000 // 30 days
    })
    await accessToken.save()

    // Emit event
    await eventEmitter.emitAccessTokenGenerated()
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      token_type: 'Bearer',
      access_token: accessToken.value,
      refresh_token: refreshToken.value,
      expires_in: accessToken.expiresIn
    })
  }
}

/**
 * Error handler
 * 
 * @param {Object} handler
 */
const errorRaised = (handler, next) => {
  const grantType = handler.event.body ? handler.event.body.grant_type : ''
  if (grantType === 'authorization_code') { 
    // Emit event
    eventEmitter.emitAuthCodeExchangeError(handler.error).then(() => {
      // Event bubbling
      next(handler.error)
    })

    return
  } else if (grantType === 'refresh_token') {
    // Emit event
    eventEmitter.emitAccessTokenGenerateError(handler.error).then(() => {
      // Event bubbling
      next(handler.error)
    })

    return
  }

  // Event bubbling
  next(handler.error)   
}

/**
 * Middy handler
 */

const handler = middy(requestReceived)
  .use(inputOutLogger())
  .onError(errorRaised)
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(httpHeaderNormalizer())
  .use(ssm({
    awsSdkOptions: {
      logger: console,
    },
    cache: true,
    names: {
      'CLIENT_ID': process.env.CLIENT_ID_PARAMETER_NAME,
      'CLIENT_SECRET': process.env.CLIENT_SECRET_PARAMETER_NAME
    }
  }))
  .use(urlEncodeBodyParser({ extended: false }))
  .use(jsonBodyParser())
  .use(validation.clientId)
  .use(validation.clientSecret)
  .use(validation.grantType)

module.exports = { handler }
