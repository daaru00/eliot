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
      {
        'type': 'AlexaInterface',
        'interface': 'Alexa.ColorController',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'color'
            }
          ],
          'proactivelyReported': this.reportState,
          'retrievable': true
        }
      },
      {
        'type': 'AlexaInterface',
        'interface': 'Alexa.ColorTemperatureController',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'colorTemperatureInKelvin'
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
    this.shadow.color = this.shadow.color || {}
    this.shadow.color = Object.assign({ r: 0, g: 0, b: 0 }, this.shadow.color)
    const hsv = colorConvert.rgb.hsv(this.shadow.color.r, this.shadow.color.g, this.shadow.color.b)
    if (this.shadow.colorTemperature === undefined || this.shadow.colorTemperature === null) {
      this.shadow.colorTemperature = 2200
    }
    return Object.assign(parentState, {
      color: {
        hue: hsv[0],
        saturation: hsv[1],
        brightness: hsv[2]
      },
      colorTemperatureInKelvin: parseInt(this.shadow.colorTemperature)
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
    let newColorTemperature

    if (await super.execute(command, payload)) {
      return true
    }

    switch (command) {
      case 'Alexa.ColorController.SetColor':
        payload.color = Object.assign({ hue: 0, saturation: 0, brightness: 0 }, payload.color)
        const rgb = colorConvert.hsv.rgb([payload.color.hue, payload.color.saturation, payload.color.brightness])
        this.shadow.color = { r: rgb[0], g: rgb[1], b: rgb[2] }
        await this.saveShadow()
        return true

      case 'Alexa.ColorTemperatureController.DecreaseColorTemperature':
        this.shadow.colorTemperature = (this.shadow.colorTemperature !== undefined && this.shadow.colorTemperature !== null) ? parseInt(this.shadow.colorTemperature) : 2200

        switch (this.shadow.colorTemperature) {
          case 7000:
            newColorTemperature = 5500
            break
          case 5500:
            newColorTemperature = 4000
            break
          case 4000:
            newColorTemperature = 2700
            break
          case 2700:
            newColorTemperature = 2200
            break
          default:
            if (this.shadow.colorTemperature > 0) {
              newColorTemperature = this.shadow.colorTemperature - 100
            }
        }
        this.shadow.colorTemperature = newColorTemperature
        await this.saveShadow()
        return true

      case 'Alexa.ColorTemperatureController.IncreaseColorTemperature':
        this.shadow.colorTemperature = (this.shadow.colorTemperature !== undefined && this.shadow.colorTemperature !== null) ? parseInt(this.shadow.colorTemperature) : 2200
        switch (this.shadow.colorTemperature) {
          case 2200:
            newColorTemperature = 2700
            break
          case 2700:
            newColorTemperature = 4000
            break
          case 4000:
            newColorTemperature = 5500
            break
          case 5500:
            newColorTemperature = 7000
            break
          default:
            if (this.shadow.colorTemperature < 7000) {
              newColorTemperature = this.shadow.colorTemperature + 100
            }
        }
        this.shadow.colorTemperature = newColorTemperature
        await this.saveShadow()
        return true

      case 'Alexa.ColorTemperatureController.SetColorTemperature':
        this.shadow.colorTemperature = payload.colorTemperatureInKelvin
        await this.saveShadow()
        return true
    }

    return false
  }
}
