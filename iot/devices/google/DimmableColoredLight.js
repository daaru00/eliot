const LightDevice = require('./Light')

/**
 * Dimmable Colored Light Device
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
      'action.devices.traits.Brightness',
      'action.devices.traits.ColorSetting'
    ]
  }
}
