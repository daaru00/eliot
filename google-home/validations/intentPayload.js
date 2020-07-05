const createError = require('http-errors')

const INTENTS_WITH_PAYLOAD = [
  'action.devices.QUERY',
  'action.devices.EXECUTE'
]

/**
 * Inputs validation
 *
 */
module.exports = {
  before: async (handler) => {
    const intent = handler.event.intent || {}

    if (INTENTS_WITH_PAYLOAD.includes(intent.intent) && (intent.payload === undefined || intent.payload === null)) {
      throw createError(400, 'invalid_intent_payload')
    }
  }
}
