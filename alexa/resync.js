const middy = require('middy')
const got = require('got')
const createError = require('http-errors')
const randomstring = require('randomstring')
const loggerMiddleware = require('../common/middlewares/eventLogger')
const iotEventValidation = require('../common/validations/iotEvent')
const RefreshToken = require('../auth/models/RefreshToken')
const AccessToken = require('../auth/models/AccessToken')
const deviceCollection = require('../iot/collection')

const ALEXA_CLIENT_ID = process.env.ALEXA_CLIENT_ID
const ALEXA_CLIENT_SECRET = process.env.ALEXA_CLIENT_SECRET

const EVENT_ENDPOINT_US = 'https://api.amazonalexa.com/v3/events'
const EVENT_ENDPOINT_EU = 'https://api.eu.amazonalexa.com/v3/events'
const EVENT_ENDPOINT_FE = 'https://api.fe.amazonalexa.com/v3/events'
const TOKEN_ENDPOINT = 'https://api.amazon.com/auth/o2/token'

/**
 * Lambda handler
 */
const askResync = async (event) => {
  let accessToken = await AccessToken.provider('alexa').retrieve()

  if (accessToken === null) {
    accessToken = await askNewAccessToken()
    if (accessToken === null) {
      throw createError.UnprocessableEntity('Not found a valid Alexa credentials')
    }
  }

  const header = {
    namespace: 'Alexa.Discovery',
    payloadVersion: '3',
    messageId: randomstring.generate(40)
  }

  const payload = {
    scope: {
      type: 'BearerToken',
      token: accessToken
    }
  }

  if (event.operation === 'CREATED' || event.operation === 'UPDATED') {
    header.name = 'AddOrUpdateReport'
    payload.endpoints = await deviceCollection.list('alexa')
  } else if (event.operation === 'DELETED') {
    header.name = 'DeleteReport'
    payload.endpoints = [{
      endpointId: event.thingName
    }]
  } else {
    throw createError.BadRequest(`Action ${event.action} not supported`)
  }

  let endpoint
  switch (process.env.ALEXA_ENDPOINT) {
    case 'NorthAmerica':
      endpoint = EVENT_ENDPOINT_US
      break
    case 'Europe':
      endpoint = EVENT_ENDPOINT_EU
      break
    case 'FarEast':
      endpoint = EVENT_ENDPOINT_FE
      break
    default:
      endpoint = EVENT_ENDPOINT_US
      break
  }

  const response = await got.post(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true,
    body: {
      event: {
        header,
        payload
      }
    }
  })
  console.log('sync response', JSON.stringify(response.body))
  return response.body
}

/**
 * Ask new access token
 */
const askNewAccessToken = async () => {
  const refreshToken = await RefreshToken.provider('alexa').retrieve()
  if (refreshToken === null) {
    return null
  }
  let response = await got.post(TOKEN_ENDPOINT, {
    form: true,
    body: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: ALEXA_CLIENT_ID,
      client_secret: ALEXA_CLIENT_SECRET
    }
  })
  response = JSON.parse(response.body)
  console.log('athorization response', response)
  await AccessToken.provider('alexa').store(response.access_token, response.refresh_token, response.expires_in)
  return response.access_token
}

const handler = middy(askResync)
  .use(loggerMiddleware)
  .use(iotEventValidation)

module.exports = { handler }
