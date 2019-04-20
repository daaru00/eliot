const BaseGoogleDevice = require('../../models/BaseGoogleDevice')

/**
 * TemperatureSensor Device
 */
module.exports = class TemperatureSensor extends BaseGoogleDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.THERMOSTAT'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      'action.devices.traits.TemperatureSetting'
    ]
  }

  /**
   * Get state
   */
  async getState () {
    const parentState = await super.getState()
    if (isNaN(this.shadow.temperature)) {
      this.shadow.temperature = 0
    }
    if (isNaN(this.shadow.humidity)) {
      this.shadow.humidity = 0
    }
    if (this.shadow.humidity < 0) {
      this.shadow.humidity = 0
    }
    if (this.shadow.humidity > 100) {
      this.shadow.humidity = 100
    }
    return Object.assign(parentState, {
      thermostatTemperatureAmbient: this.shadow.temperature,
      thermostatHumidityAmbient: this.shadow.humidity
    })
  }

  /**
   * attributes
   *
   * @return {Object}
   */
  getAttributes () {
    return {
      queryOnlyTemperatureSetting: true,
      thermostatTemperatureUnit: this.attributes.temperatureUnit || 'C'
    }
  }
}
