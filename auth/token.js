const middy = require('middy')
const { urlEncodeBodyParser, httpEventNormalizer, httpErrorHandler } = require('middy/middlewares')
const loggerMiddleware = require('../common/middlewares/eventLogger')
const createError = require('http-errors')

/**
 * Models
 */
const AuthCode = require('./models/AuthCode')
const AccessToken = require('./models/AccessToken')
const RefreshToken = require('./models/RefreshToken')

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
const generateTokens = async (event) => {
  const body = event.body
  const grantType = body.grant_type
  let tokens = null

  if (grantType === 'authorization_code') {
    const code = body.code

    if (code === undefined || code.length !== 7 || await AuthCode.verify(code) === false) {
      throw createError(400, 'invalid_grant')
    }

    const newRefreshToken = await RefreshToken.provider('eliot').generate()
    tokens = await AccessToken.provider('eliot').generate(newRefreshToken)
    await AuthCode.destroy(code)

    return {
      statusCode: 200,
      body: JSON.stringify({
        token_type: 'Bearer',
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_in: tokens.expiresIn
      })
    }
  }

  if (grantType === 'refresh_token') {
    const refreshToken = body.refresh_token

    if (refreshToken === undefined || refreshToken.length !== 40) {
      throw createError(400, 'invalid_grant')
    }

    if (await RefreshToken.provider('eliot').verify(refreshToken) === false) {
      throw createError(400, 'invalid_grant')
    }

    tokens = await AccessToken.provider('eliot').generate(refreshToken)

    return {
      statusCode: 200,
      body: JSON.stringify({
        token_type: 'Bearer',
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_in: tokens.expiresIn
      })
    }
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      error: 'unexpected_flow'
    })
  }
}

const handler = middy(generateTokens)
  .use(loggerMiddleware)
  .use(httpEventNormalizer())
  .use(urlEncodeBodyParser({ extended: false }))
  .use(validation.clientId)
  .use(validation.clientSecret)
  .use(validation.grantType)
  .use(httpErrorHandler())

module.exports = { handler }
