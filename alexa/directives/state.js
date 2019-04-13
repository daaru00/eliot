
/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => ({
  event: {
    header: {
      messageId: directive.header.messageId + '-R',
      namespace: 'Alexa',
      name: 'StateReport',
      payloadVersion: '3'
    },
    endpoint: {
      scope: {
        type: 'BearerToken',
        token: 'access-token-from-Amazon'
      },
      endpointId: 'demo_id',
      cookie: {}
    },
    payload: {}
  },
  context: {
    properties: [{
      namespace: 'Alexa.PowerController',
      name: 'powerState',
      value: 'ON',
      timeOfSample: '2017-09-03T16:20:50.52Z',
      uncertaintyInMilliseconds: 50
    }]
  }
})
