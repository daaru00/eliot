const middy = require('middy')
const createError = require('http-errors')
const randomstring = require('randomstring')
const loggerMiddleware = require('../common/middlewares/eventLogger')
const ssmParameters = require('../common/middlewares/ssmParameters')
const iotShadowEvent = require('../common/validations/iotShadowEvent')
const deviceCollection = require('../iot/collection')

const { smarthome } = require('actions-on-google')

/**
 * Lambda handler
 */
const reportState = async (event) => {
  if (process.env.GOOGLE_JWT === undefined || process.env.GOOGLE_JWT === null) {
    return
  }
  try {
    JSON.parse(process.env.GOOGLE_JWT)
  } catch (error) {
    throw new Error('Invalid Google JWT JSON token format: ' + error.message)
  }
  const deviceId = event.thingName

  const device = await deviceCollection.loadSingleDevice('google', deviceId)
  if (device === null) {
    throw createError.NotFound()
  }
  const states = {}
  device.setShadow(event.state)
  states[deviceId] = await device.getState()

  const app = smarthome({
    jwt: JSON.parse(process.env.GOOGLE_JWT)
  })

  const response = await app.reportState({
    requestId: randomstring.generate(40),
    agentUserId: process.env.ACCOUNT_ID || 'eliot-user',
    payload: {
      devices: {
        states
      }
    }
  })
  return response
}

const handler = middy(reportState)
  .use(loggerMiddleware)
  .use(ssmParameters())
  .use(iotShadowEvent)

module.exports = { handler }
