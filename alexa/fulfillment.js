const middy = require('middy')
const createError = require('http-errors')
const loggerMiddleware = require('../common/middlewares/eventLogger')
const httpTransformer = require('./transformers/http')

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
  controllers: require('./directives/controllers'),
  state: require('./directives/state')
}

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const fulfillment = async (event) => {
  const namespace = event.directive.header.namespace
  let response = {}

  switch (namespace) {
    case 'Alexa.Authorization':
      response = await directive.authorization(event.directive)
      break
    case 'Alexa.Discovery':
      response = await directive.discovery(event.directive)
      break
    case 'Alexa':
      switch (event.directive.header.name) {
        case 'ReportState':
          response = await directive.state(event.directive)
          break
      }
      break
    default:
      if (namespace.endsWith('Controller')) {
        response = await directive.controllers(event.directive)
      } else {
        throw createError.BadRequest()
      }
  }

  return response
}

const handler = middy(fulfillment)
  .use(httpTransformer)
  .use(loggerMiddleware)
  .use(validation.token)
  .use(validation.directive)
  .use(validation.namespace)

module.exports = { handler }
