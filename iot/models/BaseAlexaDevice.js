const BaseDevice = require('./BaseDevice')

const MANUFACTURER = 'Eliot'
const DEFAULT_TYPE = 'OTHER'
const DEFAULT_CAPABILITIES = []

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
    this.timeOfSample = new Date().toJSON()
  }
  /**
   * Decorate device for Google Home
   *
   * @returns {Object}
   */
  getDescription () {
    return {
      endpointId: this.name,
      manufacturerName: MANUFACTURER,
      friendlyName: this.attributes.nickname ? this.attributes.nickname : this.name,
      description: this.attributes.description,
      displayCategories: this.getType(),
      cookie: {},
      capabilities: [
        ...this.getCapabilities(),
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
   */
  getType () {
    return DEFAULT_TYPE
  }

  /**
   * Default capabilities
   */
  getCapabilities () {
    return DEFAULT_CAPABILITIES
  }

  /**
   * Default state
   */
  async getState () {
    await super.getState()
    return []
  }
}
