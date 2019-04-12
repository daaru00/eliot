
/**
 * Intent handler
 *
 * @param {Object} intent
 * @returns {Object}
 */
module.exports = async (intent) => {
  return {
    commands: [{
      ids: ['456'],
      status: 'SUCCESS',
      states: {
        on: true,
        online: true,
        brightness: 80,
        color: {
          name: 'cerulean',
          spectrumRGB: 31655
        }
      }
    }]
  }
}
