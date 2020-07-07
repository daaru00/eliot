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
    return 'action.devices.types.SENSOR'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      'action.devices.traits.OnOff',
      'action.devices.traits.HumiditySetting',
      'action.devices.traits.TemperatureControl'
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
      on: true,
      temperatureSetpointCelsius: this.shadow.temperature,
      temperatureAmbientCelsius: this.shadow.temperature,
      humiditySetpointPercent: this.shadow.humidity,
      humidityAmbientPercent: this.shadow.humidity
    })
  }

  /**
   * attributes
   *
   * @return {Object}
   */
  getAttributes () {
    return {
      queryOnlyHumiditySetting: true,
      queryOnlyTemperatureControl: true,
      temperatureUnitForUX: this.attributes.temperatureUnit || 'C'
    }
  }
}
