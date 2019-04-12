const middy = require('middy')
const { httpEventNormalizer, httpErrorHandler } = require('middy/middlewares')
const url = require('url')
const AuthCode = require('./models/AuthCode')
const loggerMiddleware = require('../common/middlewares/eventLogger')

const validation = {
  clientId: require('./validation/clientId'),
  responseTypeCode: require('./validation/responseTypeCode'),
  redirectUri: require('./validation/redirectUri'),
  googleProjectId: require('./validation/googleProjectId')
}

/**
 * Lambda handler
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
  .use(loggerMiddleware)
  .use(httpEventNormalizer())
  .use(validation.clientId)
  .use(validation.responseTypeCode)
  .use(validation.redirectUri)
  .use(validation.googleProjectId)
  .use(httpErrorHandler())

module.exports = { handler }
