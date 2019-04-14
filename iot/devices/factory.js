const fs = require('fs')
const path = require('path')
const BaseDevice = require('../models/BaseDevice')

/**
 * Device factory
 *
 * @returns {BaseDevice}
 */
module.exports = (provider, type, iotThing) => {
  const classPath = path.join(__dirname, provider, `${type}.js`)
  if (fs.existsSync(classPath) === false) {
    return new BaseDevice(iotThing)
  }
  const DeviceClass = require(classPath)
  return new DeviceClass(iotThing)
}
