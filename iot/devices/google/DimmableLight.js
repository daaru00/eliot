const LightDevice = require('./Light')

/**
 * Dimmable Light Device
 */
module.exports = class BaseDevice extends LightDevice {
  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      'action.devices.traits.OnOff',
      'action.devices.traits.Brightness'
    ]
  }
}
