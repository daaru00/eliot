const middy = require('@middy/core')

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
 * Middlewares
 */
const iotShadowEvent = require('./validations/iotShadowEvent')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * Constants
 */
const ATTRIBUTE_SYNC_NAME = process.env.ATTRIBUTE_SYNC_NAME || 'sync'
const ATTRIBUTE_SYNC_VALUE = process.env.ATTRIBUTE_SYNC_VALUE || 'enable'
const ATTRIBUTE_TYPE_NAME = process.env.ATTRIBUTE_TYPE_NAME || 'type'

/**
 * Lambda handler
 * 
 * @param {*} event
 */
const eventReceived = async (event) => {
  // Get thing
  const thing = await iot.describeThing({
    thingName: event.thingName
  }).promise()

  // Check thing
  if (thing.attributes[ATTRIBUTE_SYNC_NAME] !== ATTRIBUTE_SYNC_VALUE) {
    console.log(`thing ${event.thingName} hasn't the sync attribute`)
    return
  }

  // Emit event for Google Smart Home
  const deviceGoogle = deviceFactory('google', thing.attributes[ATTRIBUTE_TYPE_NAME], thing)
  await eventEmitter.emitDeviceStateChanged({
    provider: 'google',
    device: event.thingName,
    state: await deviceGoogle.getState()
  })

  // Emit event for Alexa
  const deviceAlexa = deviceFactory('alexa', thing.attributes[ATTRIBUTE_TYPE_NAME], thing)
  await eventEmitter.emitDeviceStateChanged({
    provider: 'alexa',
    device: event.thingName,
    state: await deviceAlexa.getState()
  })
}

/**
 * Middy handler
 */

const handler = middy(eventReceived)
  .use(inputOutLogger())
  .use(iotShadowEvent)

module.exports = { handler }
