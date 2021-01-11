const createError = require('http-errors')

const INTENTS_WITH_PAYLOAD = [
  'action.devices.QUERY',
  'action.devices.EXECUTE'
]

const INTENTS_WITHOUT_PAYLOAD = [
  'action.devices.SYNC',
  'action.devices.DISCONNECT'
]

/**
 * Inputs validation
 *
 */
module.exports = {
  before: async ({ event }) => {
    const intent = event.body.inputs[0]

    if (!INTENTS_WITH_PAYLOAD.includes(intent.intent) && !INTENTS_WITHOUT_PAYLOAD.includes(intent.intent)) {
      throw new createError.BadRequest('invalid_intent')
    }

    if (INTENTS_WITH_PAYLOAD.includes(intent.intent) && (intent.payload === undefined || intent.payload === null)) {
      throw new createError.BadRequest('invalid_intent_payload')
    }
  }
}
