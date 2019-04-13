
/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => ({
  event: {
    header: {
      messageId: directive.header.messageId + '-R',
      namespace: 'Alexa.Authorization',
      name: 'AcceptGrant.Response',
      payloadVersion: '3'
    },
    payload: {}
  }
})
