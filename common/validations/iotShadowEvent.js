const createError = require('http-errors')

/**
 * IoT shadow event validation
 */
module.exports = {
  before: async (handler) => {
    const event = handler.event

    if (event.thingName === undefined || event.thingName === null) {
      throw createError.BadRequest()
    }

    if (event.state === undefined || event.state === null) {
      throw createError.BadRequest()
    }
  }
}
