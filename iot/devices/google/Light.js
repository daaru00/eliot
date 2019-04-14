const BaseGoogleDevice = require('../../models/BaseGoogleDevice')

/**
 * Light Device
 */
module.exports = class BaseDevice extends BaseGoogleDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.LIGHT'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      'action.devices.traits.OnOff'
    ]
  }
}
