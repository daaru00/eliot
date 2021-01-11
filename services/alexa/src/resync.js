const createError = require('http-errors')
const randomstring = require('randomstring')
const middy = require('@middy/core')

/**
 * Middlewares
 */
const ssm = require('@middy/ssm')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * Models and clients
 */
const DeviceClient = require('./clients/Device')
const deviceClient = new DeviceClient()
const AlexaTokens = require('./clients/AlexaTokens')
const alexaTokens = new AlexaTokens()
const Alexa = require('./clients/Alexa')
const alexa = new Alexa(process.env.ALEXA_ENDPOINT)

/**
 * Lambda handler
 */
const askResync = async (event) => {
  let accessToken = await alexaTokens.getAccessToken()
  if (accessToken === null) {
    throw createError.UnprocessableEntity('Not found a valid Alexa credentials')
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
    },
    endpoints: []
  }

  if (event['detail-type'] === 'Device Definition Changed') {
    header.name = 'AddOrUpdateReport'
    payload.endpoints = await deviceClient.listDevices()
  } else if (event['detail-type'] === 'Device Deleted') {
    header.name = 'DeleteReport'
    payload.endpoints = [{
      'endpointId': event.detail.device
    }]
  } else {
    throw createError.BadRequest(`Unsupported event detail type ${event['detail-type']} not supported`)
  }

  const request = {
    event: {
      header,
      payload
    }
  }
  
  console.log('sync request', JSON.stringify(request))
  const response = await alexa.executeRequest(request)
  console.log('sync response', JSON.stringify(response))

  return response
}

/**
 * Middy handler
 */
const handler = middy(askResync)
  .use(inputOutLogger())
  .use(ssm({
    awsSdkOptions: {
      logger: console,
    },
    cache: true,
    names: {
      'ALEXA_CLIENT_ID': process.env.ALEXA_CLIENT_ID_PARAMETER_NAME,
      'ALEXA_CLIENT_SECRET': process.env.ALEXA_CLIENT_SECRET_PARAMETER_NAME
    }
  }))

module.exports = { handler }
