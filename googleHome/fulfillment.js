const middy = require('middy')
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
  let response

  switch (event.intent.intent) {
    case 'action.devices.SYNC':
      response = {
        statusCode: 200,
        body: JSON.stringify(await intent.sync(event.intent))
      }
      break
    case 'action.devices.QUERY':
      response = {
        statusCode: 200,
        body: JSON.stringify(await intent.query(event.intent))
      }
      break
    case 'action.devices.EXECUTE':
      response = {
        statusCode: 200,
        body: JSON.stringify(await intent.execute(event.intent))
      }
      break
    case 'action.devices.DISCONNECT':
      await intent.disconnect(event)
      response = {
        statusCode: 200
      }
      break
    default:
      response = {
        statusCode: 400,
        body: 'invalid_intent_type'
      }
      break
  }

  return response
}

const handler = middy(fulfillment)
  .use(loggerMiddleware)
  .use(httpEventNormalizer())
  .use(jsonBodyParser())
  .use(validation.requestId)
  .use(validation.inputs)
  .use(validation.intentType)
  .use(validation.intentPayload)
  .use(httpErrorHandler())

module.exports = { handler }
