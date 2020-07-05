const BaseDevice = require('../models/BaseDevice')
const BaseAlexaDevice = require('../models/BaseAlexaDevice')
const BaseGoogleDevice = require('../models/BaseGoogleDevice')
const AlexaDevices = require('./alexa')
const GoogleDevices = require('./google')

/**
 * Device factory
 *
 * @returns {BaseDevice}
 */
module.exports = (provider, type, iotThing) => {
  if (provider === 'alexa') {
    if (AlexaDevices.hasOwnProperty(type)) {
      return new AlexaDevices[type](iotThing)
    }
    return new BaseAlexaDevice(iotThing)
  }

  if (provider === 'google') {
    if (GoogleDevices.hasOwnProperty(type)) {
      return new GoogleDevices[type](iotThing)
    }
    return new BaseGoogleDevice(iotThing)
  }

  return new BaseDevice(iotThing)
}
