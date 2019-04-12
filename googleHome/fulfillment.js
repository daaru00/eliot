const middy = require('middy')
const { httpErrorHandler, httpEventNormalizer, jsonBodyParser } = require('middy/middlewares')
const loggerMiddleware = require('../common/middlewares/eventLogger')
const authenticationMiddleware = require('../auth/middlewares/authentication')

const validation = {
  inputs: require('./validation/inputs'),
  intentPayload: require('./validation/intentPayload'),
  intentType: require('./validation/intentType'),
  requestId: require('./validation/requestId')
}

/**
 * Lambda handler
 */
const fulfillment = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      requestId: event.requestId,
      payload: {
        agentUserId: '1836.15267389',
        devices: [{
          id: '456',
          type: 'action.devices.types.LIGHT',
          traits: [
            'action.devices.traits.OnOff',
            'action.devices.traits.Brightness',
            'action.devices.traits.ColorTemperature',
            'action.devices.traits.ColorSpectrum'
          ],
          name: {
            defaultNames: ['lights out inc. bulb A19 color hyperglow'],
            name: 'lamp1',
            nicknames: ['reading lamp']
          },
          willReportState: false,
          roomHint: 'office',
          attributes: {
            temperatureMinK: 2000,
            temperatureMaxK: 6500
          },
          deviceInfo: {
            manufacturer: 'lights out inc.',
            model: 'hg11',
            hwVersion: '1.2',
            swVersion: '5.4'
          },
          customData: {
            fooValue: 12,
            barValue: false,
            bazValue: 'bar'
          }
        }]
      }
    })
  }
}

const handler = middy(fulfillment)
  .use(loggerMiddleware)
  .use(httpEventNormalizer())
  .use(jsonBodyParser())
  .use(authenticationMiddleware)
  .use(validation.requestId)
  .use(validation.inputs)
  .use(validation.intentType)
  .use(validation.intentPayload)
  .use(httpErrorHandler())

module.exports = { handler }
