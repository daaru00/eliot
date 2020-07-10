const url = require('url')
const middy = require('middy')
const { httpEventNormalizer, httpErrorHandler } = require('middy/middlewares')
const loggerMiddleware = require('../common/middlewares/eventLogger')
const ssmParameters = require('../common/middlewares/ssmParameters')

/**
 * Models
 */
const AuthCode = require('./models/AuthCode')

/**
 * Validations
 */
const validation = {
  clientId: require('./validations/clientId'),
  responseTypeCode: require('./validations/responseTypeCode'),
  redirectUri: require('./validations/redirectUri'),
  googleProjectId: require('./validations/googleProjectId')
}

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const generateAuthCode = async (event) => {
  const redirectUri = new url.URL(event.queryStringParameters.redirect_uri)
  const state = event.queryStringParameters.state
  const code = await AuthCode.generate()

  redirectUri.search = `code=${code}&state=${state}`

  return {
    statusCode: 302,
    headers: {
      'Location': redirectUri.href
    }
  }
}

const handler = middy(generateAuthCode)
  .use(httpErrorHandler())
  .use(loggerMiddleware)
  .use(ssmParameters())
  .use(httpEventNormalizer())
  .use(validation.clientId)
  .use(validation.responseTypeCode)
  .use(validation.redirectUri)
  .use(validation.googleProjectId)

module.exports = { handler }
