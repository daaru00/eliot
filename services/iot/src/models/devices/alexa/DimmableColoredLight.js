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
      }
    ]
  }

  /**
   * Get state
   */
  async getState () {
    const parentState = await super.getState()
    this.shadow.color = this.shadow.color || {}
    this.shadow.color = Object.assign({ r: 255, g: 255, b: 255 }, this.shadow.color || {})
    const hsv = colorConvert.rgb.hsv(this.shadow.color.r, this.shadow.color.g, this.shadow.color.b)
    if (this.shadow.colorTemperature === undefined || this.shadow.colorTemperature === null) {
      this.shadow.colorTemperature = 2200
    }
    parentState.push({
      'namespace': 'Alexa.ColorController',
      'name': 'color',
      'value': {
        'hue': hsv[0],
        'saturation': hsv[1] / 100,
        'brightness': hsv[2] / 100
      },
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

    let rgb = []
    switch (command) {
    case 'Alexa.ColorController.SetColor':
      payload.color = Object.assign({ hue: 0, saturation: 0, brightness: 1 }, payload.color)
      rgb = colorConvert.hsv.rgb([payload.color.hue, payload.color.saturation * 100, payload.color.brightness * 100])
      this.shadow.color = { r: rgb[0], g: rgb[1], b: rgb[2] }
      await this.saveShadow()
      return true
    }

    return false
  }
}
