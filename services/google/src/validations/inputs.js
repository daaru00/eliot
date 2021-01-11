const createError = require('http-errors')

/**
 * Inputs validation
 *
 */
module.exports = {
  before: async (handler) => {
    const body = handler.event.body || {}

    const inputs = body.inputs
    if (inputs === undefined || inputs === null || Array.isArray(inputs) === false || inputs.length === 0) {
      throw new createError.BadRequest('invalid_inputs')
    }
  }
}
