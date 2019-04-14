const colorConvert = require('color-convert')

/**
 * Report shadow change based on commands
 */
module.exports = {
  'action.devices.commands.OnOff': ({ on }) => ({
    on
  }),
  'action.devices.commands.BrightnessAbsolute': ({ brightness }) => ({
    brightness
  }),
  'action.devices.commands.ColorAbsolute': ({ temperature, spectrumHSV }) => {
    const rgb = colorConvert.hsv.rgb([spectrumHSV.hue, spectrumHSV.saturation, spectrumHSV.value])
    return {
      colorTemperature: temperature,
      color: { r: rgb[0], g: rgb[1], b: rgb[2] }
    }
  }
}
