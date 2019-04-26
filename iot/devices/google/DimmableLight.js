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
      'action.devices.traits.Brightness'
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
    return Object.assign(parentState, {
      brightness: parseInt(this.shadow.brightness)
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
      case 'action.devices.commands.BrightnessAbsolute':
        this.shadow.brightness = parseInt(payload.brightness)
        if (this.shadow.brightness < 0) {
          this.shadow.brightness = 0
        } else if (this.shadow.brightness > 100) {
          this.shadow.brightness = 100
        }
        await this.saveShadow()
        return true
    }

    return false
  }
}
