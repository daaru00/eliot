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
    this.shadow.color = Object.assign({ r: 255, g: 255, b: 255 }, this.shadow.color || {})
    const rgbHex = colorConvert.rgb.hex(this.shadow.color.r, this.shadow.color.g, this.shadow.color.b)
    if (this.shadow.colorTemperature === undefined || this.shadow.colorTemperature === null) {
      this.shadow.colorTemperature = 2200
    }
    return Object.assign(parentState, {
      color: {
        temperatureK: this.shadow.colorTemperature,
        spectrumRgb: parseInt(rgbHex, 16)
      }
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

    let rgb = []
    switch (command) {
    case 'action.devices.commands.ColorAbsolute':
      if (payload.color.spectrumRGB) {
        rgb = colorConvert.hex.rgb(parseInt(payload.color.spectrumRGB).toString(16))
      } else if (payload.color.spectrumHSV) {
        rgb = colorConvert.hsv.rgb([payload.color.spectrumHSV.hue, payload.color.spectrumHSV.saturation, payload.color.spectrumHSV.value])
      }
      if (payload.color.temperature) {
        this.shadow.colorTemperature = payload.color.temperature
      }
      this.shadow.color = { r: rgb[0], g: rgb[1], b: rgb[2] }
      await this.saveShadow()
      return true
    }

    return false
  }

  /**
   * attributes
   *
   * @return {Object}
   */
  getAttributes () {
    return {
      colorModel: 'rgb'
    }
  }
}
