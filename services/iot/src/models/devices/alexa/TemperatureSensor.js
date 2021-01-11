const BaseAlexaDevice = require('../../BaseAlexaDevice')

/**
 * TemperatureSensor Device
 */
module.exports = class TemperatureSensor extends BaseAlexaDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'TEMPERATURE_SENSOR'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      {
        'type': 'AlexaInterface',
        'interface': 'Alexa.TemperatureSensor',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'temperature'
            }
          ],
          'proactivelyReported': this.reportState,
          'retrievable': true
        }
      }
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
    parentState.push({
      'namespace': 'Alexa.TemperatureSensor',
      'name': 'temperature',
      'value': {
        'value': this.shadow.temperature,
        'scale': this.attributes.temperatureUnit === 'F' ? 'FAHRENHEIT' : 'CELSIUS'
      },
      'timeOfSample': this.timeOfSample,
      'uncertaintyInMilliseconds': this.uncertaintyInMilliseconds
    })
    return parentState
  }
}
