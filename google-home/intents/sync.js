const deviceCollection = require('../../iot/collection')

/**
 * Sync intent handler
 *
 * @returns {Object}
 */
module.exports = async () => {
  const devices = await deviceCollection.list('google')

  return {
    agentUserId: process.env.ACCOUNT_ID || 'eliot-user',
    devices: devices
  }
}
