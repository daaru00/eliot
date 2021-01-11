const BaseDevice = require('../BaseDevice')
const BaseAlexaDevice = require('../BaseAlexaDevice')
const BaseGoogleDevice = require('../BaseGoogleDevice')
const AlexaDevices = require('./alexa')
const GoogleDevices = require('./google')

/**
 * Device factory
 *
 * @returns {BaseDevice}
 */
module.exports = (provider, type, iotThing) => {
  if (provider === 'alexa') {
    if (AlexaDevices[type]) {
      return new AlexaDevices[type](iotThing)
    }
    return new BaseAlexaDevice(iotThing)
  }

  if (provider === 'google') {
    if (GoogleDevices[type]) {
      return new GoogleDevices[type](iotThing)
    }
    return new BaseGoogleDevice(iotThing)
  }

  return new BaseDevice(iotThing)
}
