const BaseDevice = require('./BaseDevice')

const MANUFACTURER = 'Eliot'
// Google cannot handle a "dummy" device, using a switch type as default
const DEFAULT_TYPE = 'action.devices.types.SWITCH'
const DEFAULT_CAPABILITIES = [
  'action.devices.traits.OnOff'
]

/**
 * Google IoT Device
 */
module.exports = class BaseGoogleDevice extends BaseDevice {
  /**
   * Decorate device for Google Smart Home
   *
   * @returns {Object}
   */
  getDescription () {
    return {
      id: this.name,
      type: this.getType(),
      traits: this.getCapabilities(),
      name: {
        name: this.name,
        nicknames: this.attributes.nickname ? [this.attributes.nickname] : []
      },
      willReportState: this.reportState,
      roomHint: this.attributes.room || 'Cloud',
      attributes: this.getAttributes(),
      deviceInfo: {
        manufacturer: MANUFACTURER,
        model: 'virtual',
        hwVersion: '1.0',
        swVersion: '1.0'
      },
      customData: {}
    }
  }

  /**
   * Default type
   *
   * @return {String}
   */
  getType () {
    return DEFAULT_TYPE
  }

  /**
   * Default capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return DEFAULT_CAPABILITIES
  }

  /**
   * Default attributes
   *
   * @return {Object}
   */
  getAttributes () {
    return {}
  }

  /**
   * Default state
   *
   * @return {Object}
   */
  async getState () {
    await super.getState()
    return {
      online: true
    }
  }
}
