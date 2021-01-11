const middy = require('@middy/core')

/**
 * Clients
 */
const eventEmitter = require('./clients/Event')

/**
 * Middlewares
 */
const iotThingEvent = require('./validations/iotThingEvent')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * Lambda handler
 * 
 * @param {*} event
 */
const eventReceived = async (event) => {

  if (['CREATED', 'UPDATED'].includes(event.operation)) {
    await eventEmitter.emitDeviceCreatedOrUpdated({
      device: event.thingName,
      operation: event.operation
    })
  } else if (event.operation === 'DELETED') {
    await eventEmitter.emitDeviceDeleted({
      device: event.thingName
    })
  }
}

/**
 * Middy handler
 */

const handler = middy(eventReceived)
  .use(inputOutLogger())
  .use(iotThingEvent)

module.exports = { handler }
