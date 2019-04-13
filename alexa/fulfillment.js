const middy = require('middy')
const createError = require('http-errors')
const loggerMiddleware = require('../common/middlewares/eventLogger')

/**
 * Validations
 */
const validation = {
  directive: require('./validations/directive'),
  namespace: require('./validations/namespace'),
  token: require('./validations/token')
}

/**
 * Directive handlers
 */
const directive = {
  authorization: require('./directives/authorization'),
  discovery: require('./directives/discovery'),
  controllers: require('./directives/controllers')
}

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const fulfillment = async (event) => {
  let response = {}

  switch (event.directive.header.namespace) {
    case 'Alexa.Authorization':
      response = await directive.authorization(event.directive)
      break
    case 'Alexa.Discovery':
      response = await directive.discovery(event.directive)
      break
    case 'Alexa.PowerController':
      response = await directive.controllers(event.directive)
      break
    default:
      throw createError.BadRequest()
  }

  return response
}

const handler = middy(fulfillment)
  .use(loggerMiddleware)
  .use(validation.token)
  .use(validation.directive)
  .use(validation.namespace)

module.exports = { handler }
