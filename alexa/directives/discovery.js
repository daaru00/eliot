
/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  const payload = {
    endpoints: [
      {
        endpointId: 'demo_id',
        manufacturerName: 'Smart Device Company',
        friendlyName: 'Bedroom Outlet',
        description: 'Smart Device Switch',
        displayCategories: ['SWITCH'],
        cookie: {
          key1: 'arbitrary key/value pairs for skill to reference this endpoint.',
          key2: 'There can be multiple entries',
          key3: 'but they should only be used for reference purposes.',
          key4: 'This is not a suitable place to maintain current endpoint state.'
        },
        capabilities: [
          {
            type: 'AlexaInterface',
            interface: 'Alexa',
            version: '3'
          },
          {
            interface: 'Alexa.PowerController',
            version: '3',
            type: 'AlexaInterface',
            properties: {
              supported: [{
                name: 'powerState'
              }],
              retrievable: true
            }
          }
        ]
      }
    ]
  }
  const header = directive.header
  header.name = 'Discover.Response'
  return { event: { header: header, payload: payload } }
}
