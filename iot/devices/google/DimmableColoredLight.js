const colorConvert = require('color-convert')
const DimmableLight = require('./DimmableLight')

/**
 * Dimmable Colored Light Device
 */
module.exports = class DimmableColoredLight extends DimmableLight {
  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      ...super.getCapabilities(),
      'action.devices.traits.ColorSetting'
    ]
  }

  /**
   * Get state
   */
  async getState () {
    const parentState = await super.getState()
    this.shadow.color = this.shadow.color || {}
    this.shadow.color = Object.assign(this.shadow.color, { r: 0, g: 0, b: 0 })
    const hsv = colorConvert.rgb.hsv(this.shadow.color.r, this.shadow.color.g, this.shadow.color.b)
    if (this.shadow.colorTemperature === undefined || this.shadow.colorTemperature === null) {
      this.shadow.colorTemperature = 2200
    }
    return Object.assign(parentState, {
      color: {
        spectrumHsv: {
          hue: hsv[0],
          saturation: hsv[1],
          value: hsv[2]
        }
      },
      temperatureK: parseInt(this.shadow.colorTemperature)
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
      case 'action.devices.commands.ColorAbsolute':
        const rgb = colorConvert.hsv.rgb([payload.spectrumHSV.hue, payload.spectrumHSV.saturation, payload.spectrumHSV.value])
        this.shadow.colorTemperature = payload.temperature
        this.shadow.color = { r: rgb[0], g: rgb[1], b: rgb[2] }
        return true
    }

    return false
  }
}
