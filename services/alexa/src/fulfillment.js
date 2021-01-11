const createError = require('http-errors')
const middy = require('@middy/core')

/**
 * Middlewares
 */

const ssm = require('@middy/ssm')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * Validations
 */
const validation = {
  directive: require('./validations/directive'),
  payloadVersion: require('./validations/payloadVersion'),
  namespace: require('./validations/namespace'),
  authorization: require('./validations/authorization')
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
 * Custom middlewares
 */
const alexaErrorHandler = require('./middlewares/error')

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
  .use(inputOutLogger())
  .use(ssm({
    awsSdkOptions: {
      logger: console,
    },
    cache: true,
    names: {
      'ALEXA_CLIENT_ID': process.env.ALEXA_CLIENT_ID_PARAMETER_NAME,
      'ALEXA_CLIENT_SECRET': process.env.ALEXA_CLIENT_SECRET_PARAMETER_NAME
    }
  }))
  .use(validation.directive)
  .use(validation.payloadVersion)
  .use(validation.authorization)
  .use(validation.namespace)
  .use(alexaErrorHandler)

module.exports = { handler }
