const fs = require('fs')
const path = require('path')
// eslint-disable-next-line no-unused-vars
const BaseDevice = require('../models/BaseDevice')

/**
 * Device factory
 *
 * @returns {BaseDevice}
 */
module.exports = (provider, type, { iotThing, endpointAddress }) => {
  const classPath = path.join(__dirname, provider, `${type}.js`)
  if (fs.existsSync(classPath) === false) {
    return null
  }
  const DeviceClass = require(classPath)
  return new DeviceClass()
}
