
/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  // get device ID passed in during discovery
  const requestMethod = directive.header.name
  directive.header.namespace = 'Alexa'
  directive.header.name = 'Response'
  directive.header.messageId = directive.header.messageId + '-R'
  // get user token pass in request
  const requestToken = directive.endpoint.scope.token
  let powerResult

  if (requestMethod === 'TurnOn') {
    // Make the call to your device cloud for control
    // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
    powerResult = 'ON'
  } else if (requestMethod === 'TurnOff') {
    // Make the call to your device cloud for control and check for success
    // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
    powerResult = 'OFF'
  }
  const contextResult = {
    properties: [{
      namespace: 'Alexa.PowerController',
      name: 'powerState',
      value: powerResult,
      timeOfSample: '2017-09-03T16:20:50.52Z', // retrieve from result.
      uncertaintyInMilliseconds: 50
    }]
  }
  return {
    context: contextResult,
    event: {
      header: directive.header,
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: requestToken
        },
        endpointId: 'demo_id'
      },
      payload: {}
    }
  }
}
