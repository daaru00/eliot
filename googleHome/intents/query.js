
/**
 * Lambda handler
 *
 * @param {Object} intent
 * @returns {Object}
 */
module.exports = async (intent) => {
  return {
    devices: {
      456: {
        on: true,
        online: true,
        brightness: 80,
        color: {
          name: 'cerulean',
          spectrumRGB: 31655
        }
      }
    }
  }
}
