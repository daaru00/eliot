const colorConvert = require('color-convert')

/**
 * Report shadow change based on commands
 */
module.exports = {
  'Alexa.PowerController.TurnOn': () => ({
    on: true
  }),
  'Alexa.PowerController.TurnOff': () => ({
    on: false
  }),
  'Alexa.BrightnessController.AdjustBrightness': ({ brightnessDelta }, shadow) => {
    if (shadow.brightness === undefined || shadow.brightness === null) {
      shadow.brightness = 0
    }
    shadow.brightness = parseInt(shadow.brightness)
    let newValue = shadow.brightness + brightnessDelta
    if (newValue < 0) {
      newValue = 0
    } else if (newValue > 100) {
      newValue = 100
    }
    return {
      brightness: newValue
    }
  },
  'Alexa.BrightnessController.SetBrightness': ({ brightness }) => ({
    brightness
  }),
  'Alexa.ColorController.SetColor': ({ color }) => {
    color = Object.assign({ hue: 0, saturation: 0, brightness: 0 }, color)
    const rgb = colorConvert.hsv.rgb([color.hue, color.saturation, color.brightness])
    return {
      color: { r: rgb[0], g: rgb[1], b: rgb[2] }
    }
  },
  'Alexa.ColorTemperatureController.DecreaseColorTemperature': (payload, shadow) => {
    shadow.colorTemperature = (shadow.colorTemperature !== undefined && shadow.colorTemperature !== null) ? parseInt(shadow.colorTemperature) : 2200
    let newColorTemperature
    switch (shadow.colorTemperature) {
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
        if (shadow.colorTemperature > 0) {
          newColorTemperature = shadow.colorTemperature - 100
        }
    }
    return {
      colorTemperature: newColorTemperature
    }
  },
  'Alexa.ColorTemperatureController.IncreaseColorTemperature': (payload, shadow) => {
    shadow.colorTemperature = (shadow.colorTemperature !== undefined && shadow.colorTemperature !== null) ? parseInt(shadow.colorTemperature) : 2200
    let newColorTemperature
    switch (shadow.colorTemperature) {
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
        if (shadow.colorTemperature < 7000) {
          newColorTemperature = shadow.colorTemperature + 100
        }
    }
    return {
      colorTemperature: newColorTemperature
    }
  },
  'Alexa.ColorTemperatureController.SetColorTemperature': ({ colorTemperatureInKelvin }) => ({
    colorTemperature: colorTemperatureInKelvin
  })
}
