const createError = require('http-errors')
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
const Iot = require('aws-sdk/clients/iot')
const iot = new Iot({ 
  apiVersion: '2015-05-28',
  logger: console
})

/**
 * Models and clients
 */
const deviceFactory = require('./models/devices/factory')
const eventEmitter = require('./clients/Event')

/**
 * Constants
 */
const ATTRIBUTE_TYPE_NAME = process.env.ATTRIBUTE_TYPE_NAME || 'type'

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const requestReceived = async (event) => {
  // Get device
  const thing = await iot.describeThing({
    thingName: event.pathParameters.deviceId
  }).promise()
  if (thing === null) {
    // Emit event
    await eventEmitter.emitDeviceNotFoundError({
      provider: event.pathParameters.providerName,
      device: event.pathParameters.deviceId
    })

    // Raise error
    throw new createError.NotFound()
  }

  // Load device info
  const device = deviceFactory(event.pathParameters.providerName, thing.attributes[ATTRIBUTE_TYPE_NAME], thing)

  // Execute command
  const { command, payload = {} } = event.body
  const handled = await device.execute(command, payload)

  // Check if command was executed
  if (handled === false) {
    // Emit event
    await eventEmitter.emitDeviceCommandNotImplementedError({
      provider: event.pathParameters.providerName,
      device: event.pathParameters.deviceId,
      command,
      payload
    })

    // Raise error
    throw new createError.NotImplemented()
  }

  // Emit event
  await eventEmitter.emitDeviceCommandExecuted({
    provider: event.pathParameters.providerName,
    device: event.pathParameters.deviceId,
    command,
    payload
  })

  // Return device state
  return {
    statusCode: 200,
    body: JSON.stringify(await device.getState())
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
