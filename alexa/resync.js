const middy = require('middy')
const got = require('got')
const createError = require('http-errors')
const randomstring = require('randomstring')
const loggerMiddleware = require('../common/middlewares/eventLogger')
const ssmParameters = require('../common/middlewares/ssmParameters')
const iotThingEvent = require('../common/validations/iotThingEvent')
const AccessToken = require('../auth/models/AccessToken')
const deviceCollection = require('../iot/collection')
const AccessTokenRequest = require('./models/AccessTokenRequest')

const EVENT_ENDPOINT_US = 'https://api.amazonalexa.com/v3/events'
const EVENT_ENDPOINT_EU = 'https://api.eu.amazonalexa.com/v3/events'
const EVENT_ENDPOINT_FE = 'https://api.fe.amazonalexa.com/v3/events'

/**
 * Lambda handler
 */
const askResync = async (event) => {
  let accessToken = await AccessToken.provider('alexa').retrieve()

  if (accessToken === null) {
    accessToken = await AccessTokenRequest.ask()
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
  const request = {
    event: {
      header,
      payload
    }
  }
  console.log('sync request', JSON.stringify(request))
  const response = await got.post(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true,
    body: request
  })
  console.log('sync response', JSON.stringify(response.body))
  return response.body
}

const handler = middy(askResync)
  .use(loggerMiddleware)
  .use(ssmParameters())
  .use(iotThingEvent)

module.exports = { handler }
