const middy = require('middy')
const createError = require('http-errors')
const { httpErrorHandler, httpEventNormalizer, jsonBodyParser } = require('middy/middlewares')
const loggerMiddleware = require('../common/middlewares/eventLogger')

/**
 * Validations
 */
const validation = {
  inputs: require('./validations/inputs'),
  intentPayload: require('./validations/intentPayload'),
  intentType: require('./validations/intentType'),
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
const fulfillment = async (event) => {
  let payload

  switch (event.intent.intent) {
    case 'action.devices.SYNC':
      payload = await intent.sync()
      break
    case 'action.devices.QUERY':
      payload = await intent.query(event.intent.payload)
      break
    case 'action.devices.EXECUTE':
      payload = await intent.execute(event.intent.payload)
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
      requestId: event.requestId,
      payload
    })
  }
}

const handler = middy(fulfillment)
  .use(httpErrorHandler())
  .use(loggerMiddleware)
  .use(httpEventNormalizer())
  .use(jsonBodyParser())
  .use(validation.requestId)
  .use(validation.inputs)
  .use(validation.intentType)
  .use(validation.intentPayload)

module.exports = { handler }
