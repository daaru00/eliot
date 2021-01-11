const createError = require('http-errors')
const randomstring = require('randomstring')
const middy = require('@middy/core')

/**
 * Middlewares
 */
const ssm = require('@middy/ssm')
const inputOutLogger = require('@middy/input-output-logger')

/**
 * Models
 */
const AlexaTokens = require('./clients/AlexaTokens')
const alexaTokens = new AlexaTokens()
const Alexa = require('./clients/Alexa')
const alexa = new Alexa(process.env.ALEXA_ENDPOINT)

/**
 * Lambda handler
 */
const reportState = async ({ detail }) => {
  let accessToken = await alexaTokens.getAccessToken()
  if (accessToken === null) {
    throw createError.UnprocessableEntity('Not found a valid Alexa credentials')
  }

  const header = {
    namespace: 'Alexa',
    name: 'ChangeReport',
    payloadVersion: '3',
    messageId: randomstring.generate(40)
  }

  const request = {
    event: {
      header,
      payload: {
        change: {
          cause: {
            type: 'PHYSICAL_INTERACTION'
          },
          properties: detail.state
        }
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: accessToken
        },
        endpointId: detail.device,
        cookie: {}
      }
    }, 
    context: {
      properties: []
    }
  }

  console.log('report state request', JSON.stringify(request))
  const response = await alexa.executeRequest(request)
  console.log('report state response', JSON.stringify(response))
}

const handler = middy(reportState)
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

module.exports = { handler }
