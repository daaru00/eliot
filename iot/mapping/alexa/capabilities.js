/**
 * Mapping capabilities
 */
module.exports = {
  'OnOff': {
    interface: 'Alexa.PowerController',
    version: '3',
    type: 'AlexaInterface',
    properties: {
      supported: [{
        name: 'powerState'
      }],
      retrievable: true
    }
  },
  'Brightness': {
    type: 'AlexaInterface',
    interface: 'Alexa.BrightnessController',
    version: '3',
    properties: {
      supported: [{
        name: 'brightness'
      }],
      retrievable: true
    }
  },
  'Color': {
    type: 'AlexaInterface',
    interface: 'Alexa.ColorController',
    version: '3',
    properties: {
      supported: [{
        name: 'color'
      }],
      retrievable: true
    }
  },
  'ColorTemperature': {
    type: 'AlexaInterface',
    interface: 'Alexa.ColorTemperatureController',
    version: '3',
    properties: {
      supported: [{
        name: 'brightness'
      }],
      retrievable: true
    }
  }
}
