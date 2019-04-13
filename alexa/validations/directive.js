const createError = require('http-errors')

/**
 * Directive validation
 */
module.exports = {
  before: async (handler) => {
    const directive = handler.event.directive

    if (directive === undefined || directive === null) {
      throw createError.BadRequest()
    }

    if (!directive.header || !directive.payload) {
      throw createError.BadRequest()
    }
  }
}
