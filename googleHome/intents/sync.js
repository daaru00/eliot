const deviceCollection = require('../../iot/collection')

/**
 * Intent handler
 *
 * @param {Object} intent
 * @returns {Object}
 */
module.exports = async (intent) => {
  const devices = await deviceCollection.list('google')

  return {
    agentUserId: process.env.ACCOUNT_ID || 'eliot-user',
    devices: devices
  }
}
