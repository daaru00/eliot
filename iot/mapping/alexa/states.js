const colorConvert = require('color-convert')

/**
 * Mapping capability and state
 */
module.exports = {
  'OnOff': (shadow) => ({
    powerState: (shadow.on !== undefined && shadow.on !== null) ? shadow.on === true : false
  }),
  'Brightness': (shadow) => {
    if (shadow.brightness === undefined || shadow.brightness === null) {
      shadow.brightness = 0
    }
    shadow.brightness = parseInt(shadow.brightness)
    if (shadow.brightness < 0) {
      shadow.brightness = 0
    } else if (shadow.brightness > 100) {
      shadow.brightness = 100
    }
    return shadow.brightness
  },
  'Color': (shadow) => {
    shadow.color = shadow.color || {}
    shadow.color = Object.assign({ r: 0, g: 0, b: 0 }, shadow.color)
    const hsv = colorConvert.rgb.hsv(shadow.color.r, shadow.color.g, shadow.color.b)
    return {
      color: {
        hue: hsv[0],
        saturation: hsv[1],
        brightness: hsv[2]
      }
    }
  },
  'ColorTemperature': (shadow) => ({
    colorTemperatureInKelvin: (shadow.colorTemperature !== undefined && shadow.colorTemperature !== null) ? parseInt(shadow.colorTemperature) : 2200
  })
}
