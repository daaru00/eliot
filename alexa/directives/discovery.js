const deviceCollection = require('../../iot/collection')

/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  const devices = await deviceCollection.list('alexa')
  const header = directive.header
  header.name = 'Discover.Response'
  return {
    event: {
      header: header,
      payload: {
        endpoints: devices
      }
    }
  }
}
