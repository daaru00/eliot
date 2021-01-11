const BaseDevice = require('./BaseDevice')

const MANUFACTURER = 'Eliot'
const DEFAULT_TYPE = 'OTHER'
const DEFAULT_CAPABILITIES = []
const DEFAULT_DESCRIPTION = 'Device syncronized from AWS IoT'

/**
 * Google IoT Device
 */
module.exports = class BaseAlexaDevice extends BaseDevice {
  /**
   * Constructor
   *
   * @param {Object} iotThing
   */
  constructor (iotThing) {
    super(iotThing)
    this.uncertaintyInMilliseconds = 500
  }
  /**
   * Decorate device for Google Smart Home
   *
   * @returns {Object}
   */
  getDescription () {
    return {
      endpointId: this.name,
      friendlyName: this.attributes.nickname ? this.attributes.nickname : this.name,
      description: this.attributes.description || DEFAULT_DESCRIPTION,
      manufacturerName: MANUFACTURER,
      displayCategories: [
        this.getType()
      ],
      cookie: {},
      capabilities: [
        ...this.getCapabilities(),
        {
          type: "AlexaInterface",
          interface: "Alexa.EndpointHealth",
          version: "3",
          properties: {
            supported: [
              {
                name: "connectivity"
              }
            ],
            proactivelyReported: true,
            retrievable: true
          }
        },
        {
          type: 'AlexaInterface',
          interface: 'Alexa',
          version: '3'
        }
      ]
    }
  }

  /**
   * Default type
   *
   * @returns {String}
   */
  getType () {
    return DEFAULT_TYPE
  }

  /**
   * Default capabilities
   *
   * @returns {Array}
   */
  getCapabilities () {
    return DEFAULT_CAPABILITIES
  }

  /**
   * Default state
   *
   * @return {Array}
   */
  async getState () {
    await super.getState()
    const properties = [{
      namespace: 'Alexa.EndpointHealth',
      name: 'connectivity',
      value: {
        value: 'OK' // devices shadows are always online
      },
      timeOfSample: this.timeOfSample,
      uncertaintyInMilliseconds: this.uncertaintyInMilliseconds
    }]
    return properties
  }
}
