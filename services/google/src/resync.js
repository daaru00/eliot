const middy = require('@middy/core')
const { smarthome } = require('actions-on-google')

/**
 * Middlewares
 */
const ssm = require('@middy/ssm')
const inputOutLogger = require('@middy/input-output-logger')
const errorLogger = require('@middy/error-logger')

/**
 * Lambda handler
 */
const eventReceived = async () => {
  // Retrieve JWT token
  let jwt = {}
  try {
    jwt = JSON.parse(process.env.GOOGLE_JWT)
  } catch (error) {
    throw new Error('Invalid Google JWT JSON token: ' + error.message)
  }

  // Authenticate client
  const app = smarthome({
    jwt
  })

  // Execute Google resync request
  const data = await app.requestSync(process.env.ACCOUNT_ID || 'eliot-user')
  return data
}

/**
 * Middy handler
 */
const handler = middy(eventReceived)
  .use(errorLogger())
  .use(inputOutLogger())
  .use(ssm({
    awsSdkOptions: {
      logger: console,
    },
    cache: true,
    names: {
      'GOOGLE_JWT': process.env.GOOGLE_JWT_PARAMETER_NAME
    }
  }))

module.exports = { handler }
