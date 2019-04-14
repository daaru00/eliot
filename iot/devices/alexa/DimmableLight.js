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
    await this.loadShadow()
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

    return Object.assign(parentState, {
      brightness: this.shadow.brightness
    })
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
      case 'Alexa.BrightnessController.AdjustBrightness':
        if (this.shadow.brightness === undefined || this.shadow.brightness === null) {
          this.shadow.brightness = 0
        }
        this.shadow.brightness = parseInt(this.shadow.brightness)
        let newValue = this.shadow.brightness + payload.brightnessDelta
        if (newValue < 0) {
          newValue = 0
        } else if (newValue > 100) {
          newValue = 100
        }
        this.shadow.brightness = newValue
        await this.saveShadow()
        return true
      case 'Alexa.BrightnessController.SetBrightness':
        this.shadow.brightness = payload.brightness
        await this.saveShadow()
        return true
    }

    return false
  }
}
