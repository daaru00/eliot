const createError = require('http-errors')
const middy = require('@middy/core')

/**
 * Middlewares
 */
const httpEventNormalizer = require('@middy/http-event-normalizer')
const jsonBodyParser = require('@middy/http-json-body-parser')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * Validations
 */
const validation = {
  inputs: require('./validations/inputs'),
  intent: require('./validations/intent'),
  requestId: require('./validations/requestId')
}

/**
 * Intent handlers
 */
const intent = {
  disconnect: require('./intents/disconnect'),
  execute: require('./intents/execute'),
  query: require('./intents/query'),
  sync: require('./intents/sync')
}

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const fulfillment = async ({ body }) => {
  const intentData = body.inputs[0]

  let response
  switch (intentData.intent) {
  case 'action.devices.SYNC':
    response = await intent.sync()
    break
  case 'action.devices.QUERY':
    response = await intent.query(intentData.payload)
    break
  case 'action.devices.EXECUTE':
    response = await intent.execute(intentData.payload)
    break
  case 'action.devices.DISCONNECT':
    await intent.disconnect()
    return {
      statusCode: 200
    }
  default:
    throw createError.BadRequest()
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      requestId: body.requestId,
      payload: response
    })
  }
}

/**
 * Middy handler
 */
const handler = middy(fulfillment)
  .use(inputOutLogger())
  .use(httpEventNormalizer())
  .use(jsonBodyParser())
  .use(validation.requestId)
  .use(validation.inputs)
  .use(validation.intent)

module.exports = { handler }
