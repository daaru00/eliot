const LightDevice = require('./Light')

/**
 * Dimmable Light Device
 */
module.exports = class DimmableLight extends LightDevice {
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
        'interface': 'Alexa.BrightnessController',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'brightness'
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

    if (this.shadow.brightness === undefined || this.shadow.brightness === null) {
      this.shadow.brightness = 0
    }
    this.shadow.brightness = parseInt(this.shadow.brightness)
    if (this.shadow.brightness < 0) {
      this.shadow.brightness = 0
    } else if (this.shadow.brightness > 100) {
      this.shadow.brightness = 100
    }

    parentState.push({
      'namespace': 'Alexa.BrightnessController',
      'name': 'brightness',
      'value': this.shadow.brightness,
      'timeOfSample': this.timeOfSample,
      'uncertaintyInMilliseconds': this.uncertaintyInMilliseconds
    })
    return parentState
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

    let newValue = null;
    switch (command) {
    case 'Alexa.BrightnessController.AdjustBrightness':
      if (this.shadow.brightness === undefined || this.shadow.brightness === null) {
        this.shadow.brightness = 0
      }
      this.shadow.brightness = parseInt(this.shadow.brightness)
      newValue = this.shadow.brightness + payload.brightnessDelta
      if (newValue < 0) {
        newValue = 0
      } else if (newValue > 100) {
        newValue = 100
      }
      this.shadow.brightness = newValue
      await this.saveShadow()
      return true
    case 'Alexa.BrightnessController.SetBrightness':
      this.shadow.brightness = parseInt(payload.brightness)
      await this.saveShadow()
      return true
    }

    return false
  }
}
