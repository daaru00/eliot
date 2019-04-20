const createError = require('http-errors')

const SUPPORTED_OPERATIONS = [
  'CREATED',
  'UPDATED',
  'DELETED'
]

/**
 * IoT event validation
 */
module.exports = {
  before: async (handler) => {
    const event = handler.event

    if (
      event.eventType === undefined ||
      event.eventType === null ||
      event.eventType !== 'THING_EVENT'
    ) {
      throw createError.BadRequest()
    }

    if (
      event.operation === undefined ||
      event.operation === null ||
      SUPPORTED_OPERATIONS.includes(event.operation) === false
    ) {
      throw createError.BadRequest()
    }

    if (
      event.attributes === undefined ||
      event.attributes === null ||
      event.attributes.sync !== 'enable'
    ) {
      throw createError.UnprocessableEntity()
    }
  }
}
