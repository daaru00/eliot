const randomstring = require('randomstring')
const { smarthome } = require('actions-on-google')
const middy = require('@middy/core')

/**
 * Middlewares
 */
const ssm = require('@middy/ssm')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * Lambda handler
 */
const reportState = async ({ detail }) => {
  // Retrieve JWT token
  let jwt = {}
  try {
    jwt = JSON.parse(process.env.GOOGLE_JWT)
  } catch (error) {
    throw new Error('Invalid Google JWT JSON token: ' + error.message)
  }

  // Prepare state report
  const states = {}
  states[detail.device] = detail.state

  // Authenticate client
  const app = smarthome({
    jwt
  })

  // Report state
  const request = {
    requestId: randomstring.generate(40),
    agentUserId: process.env.ACCOUNT_ID || 'eliot-user',
    payload: {
      devices: {
        states
      }
    }
  }
  console.log('report request', JSON.stringify(request))
  const response = await app.reportState(request)
  return response
}

/**
 * Middy handler
 */
const handler = middy(reportState)
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
