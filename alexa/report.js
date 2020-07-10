const middy = require('middy')
const got = require('got')
const createError = require('http-errors')
const randomstring = require('randomstring')
const loggerMiddleware = require('../common/middlewares/eventLogger')
const ssmParameters = require('../common/middlewares/ssmParameters')
const iotShadowEvent = require('../common/validations/iotShadowEvent')
const AccessToken = require('../auth/models/AccessToken')
const deviceCollection = require('../iot/collection')
const AccessTokenRequest = require('./models/AccessTokenRequest')

const EVENT_ENDPOINT_US = 'https://api.amazonalexa.com/v3/events'
const EVENT_ENDPOINT_EU = 'https://api.eu.amazonalexa.com/v3/events'
const EVENT_ENDPOINT_FE = 'https://api.fe.amazonalexa.com/v3/events'

/**
 * Lambda handler
 */
const reportState = async (event) => {
  let accessToken = await AccessToken.provider('alexa').retrieve()

  if (accessToken === null) {
    accessToken = await AccessTokenRequest.ask()
    if (accessToken === null) {
      throw createError.UnprocessableEntity('Not found a valid Alexa credentials')
    }
  }

  const deviceId = event.thingName

  const header = {
    namespace: 'Alexa',
    name: 'ChangeReport',
    payloadVersion: '3',
    messageId: randomstring.generate(40)
  }

  const device = await deviceCollection.loadSingleDevice('alexa', deviceId)
  if (device === null) {
    throw createError.NotFound()
  }
  device.setShadow(event.state)
  const state = await device.getState()

  const request = {
    event: {
      header,
      payload: {
        change: {
          cause: {
            type: 'PHYSICAL_INTERACTION'
          },
          properties: state
        }
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: accessToken
        },
        endpointId: deviceId,
        cookie: {}
      }
    }
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
  console.log('report state request', JSON.stringify(request))
  const response = await got.post(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true,
    body: request
  })
  console.log('report state response', JSON.stringify(response.body))
  return response.body
}

const handler = middy(reportState)
  .use(loggerMiddleware)
  .use(ssmParameters())
  .use(iotShadowEvent)

module.exports = { handler }
