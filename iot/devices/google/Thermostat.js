const BaseGoogleDevice = require('../../models/BaseGoogleDevice')

/**
 * Thermostat Device
 */
module.exports = class Thermostat extends BaseGoogleDevice {
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
    if (isNaN(this.shadow.temperatureSetpoint)) {
      if (isNaN(this.shadow.temperature)) {
        this.shadow.temperatureSetpoint = 0
        this.shadow.temperature = 0
      } else {
        this.shadow.temperatureSetpoint = this.shadow.temperature
      }
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
    if (this.shadow.mode === undefined || this.shadow.mode === null) {
      this.shadow.mode = this.getModes()[0]
    }
    if (this.shadow.mode === 'heatcool') {
      if (isNaN(this.shadow.temperatureSetpointHigh)) {
        this.shadow.temperatureSetpointHigh = 21
      }
      if (isNaN(this.shadow.temperatureSetpointLow)) {
        this.shadow.temperatureSetpointLow = 18
      }
    } else {
      delete this.shadow.temperatureSetpointHigh
      delete this.shadow.temperatureSetpointLow
    }
    return Object.assign(parentState, {
      thermostatMode: this.shadow.mode,
      thermostatTemperatureSetpoint: this.shadow.temperatureSetpoint,
      thermostatTemperatureSetpointHigh: this.shadow.temperatureSetpointHigh,
      thermostatTemperatureSetpointLow: this.shadow.temperatureSetpointLow,
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
      thermostatTemperatureUnit: this.attributes.temperatureUnit || 'C',
      bufferRangeCelsius: this.attributes.bufferRangeCelsius || 2,
      availableThermostatModes: this.getModes().join(',')
    }
  }

  /**
   * Get available modes
   *
   * @returns {Array}
   */
  getModes () {
    const modes = this.attributes.availableModes || 'off,heat,cool,auto'
    return modes.split(',').filter(value => value.trim() !== '')
  }

  /**
   * Execute command
   *
   * @param {String} command
   * @param {Object} payload
   * @returns {Boolean}
   */
  async execute (command, payload) {
    if (await super.execute(command, payload)) {
      return true
    }

    switch (command) {
      case 'action.devices.commands.ThermostatTemperatureSetpoint':
        this.shadow.temperatureSetpoint = payload.thermostatTemperatureSetpoint || 0
        await this.saveShadow()
        return true
      case 'action.devices.commands.ThermostatTemperatureSetRange':
        this.shadow.temperatureSetpointHigh = payload.thermostatTemperatureSetpointHigh || 18
        this.shadow.temperatureSetpointLow = payload.thermostatTemperatureSetpointLow || 21
        await this.saveShadow()
        return true
      case 'action.devices.commands.ThermostatSetMode':
        this.shadow.mode = payload.thermostatMode || this.getModes()[0]
        await this.saveShadow()
        return true
    }

    return false
  }
}
