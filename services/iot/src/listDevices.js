const middy = require('@middy/core')

/**
 * Middlewares
 */
const httpEventNormalizer = require('@middy/http-event-normalizer')
const httpErrorHandler = require('@middy/http-error-handler')
const httpHeaderNormalizer = require('@middy/http-header-normalizer')
const jsonBodyParser = require('@middy/http-json-body-parser')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * AWS Clients
 */
const IotData = require('aws-sdk/clients/iotdata')
const Iot = require('aws-sdk/clients/iot')
const iot = new Iot({ 
  apiVersion: '2015-05-28',
  logger: console
})

/**
 * Models
 */
/* eslint-disable no-unused-vars */
const BaseDevice = require('./models/BaseDevice')
const deviceFactory = require('./models/devices/factory')

/**
 * Constants
 */
const ATTRIBUTE_SYNC_NAME = process.env.ATTRIBUTE_SYNC_NAME || 'sync'
const ATTRIBUTE_SYNC_VALUE = process.env.ATTRIBUTE_SYNC_VALUE || 'enable'
const ATTRIBUTE_TYPE_NAME = process.env.ATTRIBUTE_TYPE_NAME || 'type'
const CONCURRENT_SHADOW_GET = process.env.CONCURRENT_SHADOW_GET || 5

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const requestReceived = async (event) => {
  /** @type {BaseDevice[]} */
  let devices = []

  // List devices
  let response = {}
  do {
    response = await iot.listThings({
      attributeName: ATTRIBUTE_SYNC_NAME,
      attributeValue: ATTRIBUTE_SYNC_VALUE,
      maxResults: 250
    }).promise()
    devices = devices.concat(
      response.things.map(thing => deviceFactory(event.pathParameters.providerName, thing.attributes[ATTRIBUTE_TYPE_NAME], thing))
    )
  } while (response.nextToken !== null)
  devices = devices.filter(device => device !== null)

  // Bootstrap a single data client
  const endpoint = await iot.describeEndpoint({
    endpointType: 'iot:Data'
  }).promise()
  const dataClient = new IotData({ endpoint: endpoint.endpointAddress })

  // Load devices shadow
  let chunk = []
  const length = devices.length
  if (length === 0) {
    return
  }
  for (let i = 0; i < length; i += CONCURRENT_SHADOW_GET) {
    chunk = devices.slice(i, i + CONCURRENT_SHADOW_GET)
    await Promise.all(chunk.map((device) => device.loadShadow(dataClient)))
  }

  // Return device descriptions
  return {
    statusCode: 200,
    body: JSON.stringify({
      devices: devices.map(device => device.getDescription())
    })
  }
}

/**
 * Middy handler
 */

const handler = middy(requestReceived)
  .use(inputOutLogger())
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())

module.exports = { handler }
