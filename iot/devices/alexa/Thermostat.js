const TemperatureSensor = require('./TemperatureSensor')

/**
 * Thermostat Device
 */
module.exports = class Thermostat extends TemperatureSensor {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'THERMOSTAT'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      ...super.getCapabilities(),
      {
        'type': 'AlexaInterface',
        'interface': 'Alexa.ThermostatController',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'targetSetpoint'
            },
            {
              'name': 'lowerSetpoint'
            },
            {
              'name': 'upperSetpoint'
            },
            {
              'name': 'thermostatMode'
            }
          ],
          'proactivelyReported': this.reportState,
          'retrievable': true
        },
        'configuration': this.getConfigurations()
      }
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
      } else {
        this.shadow.temperatureSetpoint = this.shadow.temperature
      }
    }
    parentState.push({
      'namespace': 'Alexa.ThermostatController',
      'name': 'targetSetpoint',
      'value': {
        'value': this.shadow.temperatureSetpoint,
        'scale': this.attributes.temperatureUnit === 'F' ? 'FAHRENHEIT' : 'CELSIUS'
      },
      'timeOfSample': this.timeOfSample,
      'uncertaintyInMilliseconds': this.uncertaintyInMilliseconds
    })
    if (this.shadow.mode === undefined || this.shadow.mode === null) {
      this.shadow.mode = this.getModes()[0]
    }
    parentState.push({
      'namespace': 'Alexa.ThermostatController',
      'name': 'thermostatMode',
      'value': this.shadow.mode.toUpperCase(),
      'timeOfSample': this.timeOfSample,
      'uncertaintyInMilliseconds': this.uncertaintyInMilliseconds
    })
    if (this.shadow.mode.toLowerCase() === 'auto') {
      if (isNaN(this.shadow.temperatureSetpointHigh)) {
        this.shadow.temperatureSetpointHigh = 21
      }
      if (isNaN(this.shadow.temperatureSetpointLow)) {
        this.shadow.temperatureSetpointLow = 18
      }
      parentState.push({
        'namespace': 'Alexa.ThermostatController',
        'name': 'upperSetpoint',
        'value': {
          'value': this.shadow.temperatureSetpointLow,
          'scale': this.attributes.temperatureUnit === 'F' ? 'FAHRENHEIT' : 'CELSIUS'
        },
        'timeOfSample': this.timeOfSample,
        'uncertaintyInMilliseconds': this.uncertaintyInMilliseconds
      })
      parentState.push({
        'namespace': 'Alexa.ThermostatController',
        'name': 'lowerSetpoint',
        'value': {
          'value': this.shadow.temperatureSetpointHigh,
          'scale': this.attributes.temperatureUnit === 'F' ? 'FAHRENHEIT' : 'CELSIUS'
        },
        'timeOfSample': this.timeOfSample,
        'uncertaintyInMilliseconds': this.uncertaintyInMilliseconds
      })
    }
    return parentState
  }

  /**
   * Get configurations
   *
   * @returns {Object}
   */
  getConfigurations () {
    return {
      supportsScheduling: false,
      supportedModes: this.getModes()
    }
  }

  /**
   * Get available modes
   *
   * @returns {Array}
   */
  getModes () {
    const modes = this.attributes.availableModes || 'off,heat,cool,auto'
    return modes.split(',').filter(value => value.trim() !== '').map(value => value.toUpperCase())
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
      case 'Alexa.ThermostatController.SetTargetTemperature':
        if (payload.targetSetpoint) {
          this.shadow.temperatureSetpoint = payload.targetSetpoint.value
        }
        if (payload.lowerSetpoint) {
          this.shadow.temperatureSetpointHigh = payload.lowerSetpoint.value
        }
        if (payload.upperSetpoint) {
          this.shadow.temperatureSetpointLow = payload.upperSetpoint.value
        }
        await this.saveShadow()
        return true
      case 'Alexa.ThermostatController.AdjustTargetTemperature':
        if (isNaN(this.shadow.temperatureSetpoint)) {
          this.shadow.temperatureSetpoint = 0
        }
        this.shadow.temperatureSetpoint += payload.targetSetpointDelta.value
        await this.saveShadow()
        return true
      case 'Alexa.ThermostatController.SetThermostatMode':
        this.shadow.mode = payload.thermostatMode.value.toLowerCase()
        await this.saveShadow()
        return true
    }

    return false
  }
}
