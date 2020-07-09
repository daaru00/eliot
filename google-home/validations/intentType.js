const createError = require('http-errors')

const SUPPORTED_INTENTS = [
  'action.devices.SYNC',
  'action.devices.QUERY',
  'action.devices.EXECUTE',
  'action.devices.DISCONNECT'
]

/**
 * Inputs validation
 *
 */
module.exports = {
  before: async (handler) => {
    const intent = handler.event.intent || {}

    if (intent === undefined || intent === null || SUPPORTED_INTENTS.includes(intent.intent) === false) {
      throw new createError.BadRequest('invalid_intent_type')
    }
  }
}
