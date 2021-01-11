const createError = require('http-errors')

/**
 * Constants
 */
const SUPPORTED_OPERATIONS = [
  'CREATED',
  'UPDATED',
  'DELETED'
]
const ATTRIBUTE_SYNC_NAME = process.env.ATTRIBUTE_SYNC_NAME || 'sync'
const ATTRIBUTE_SYNC_VALUE = process.env.ATTRIBUTE_SYNC_VALUE || 'enable'

/**
 * IoT thing event validation
 */
module.exports = {
  before: async (handler) => {
    const event = handler.event

    if (
      event.eventType === undefined ||
      event.eventType === null ||
      event.eventType !== 'THING_EVENT'
    ) {
      throw createError.BadRequest(`invalid eventType ${event.eventType},`)
    }

    if (
      event.operation === undefined ||
      event.operation === null ||
      SUPPORTED_OPERATIONS.includes(event.operation) === false
    ) {
      throw createError.BadRequest(`invalid operation ${event.operation}`)
    }

    if (
      event.attributes === undefined ||
      event.attributes === null ||
      event.attributes[ATTRIBUTE_SYNC_NAME] !== ATTRIBUTE_SYNC_VALUE
    ) {
      throw createError.UnprocessableEntity(`thing has not sync attribute`)
    }
  }
}
