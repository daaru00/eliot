const MANUFACTURER = 'Eliot'
const DEFAULT_TYPE = 'OTHER'
const DEFAULT_CAPABILITIES = []

/**
 * Google IoT Device
 */
module.exports = class BaseAlexaDevice {
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
        {
          type: 'AlexaInterface',
          interface: 'Alexa',
          version: '3'
        },
        ...this.getCapabilities()
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
}
