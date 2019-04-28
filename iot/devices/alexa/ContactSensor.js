const BaseAlexaDevice = require('../../models/BaseAlexaDevice')

/**
 * ContactSensor Device
 */
module.exports = class ContactSensor extends BaseAlexaDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'CONTACT_SENSOR'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      {
        'type': 'AlexaInterface',
        'interface': 'Alexa.ContactSensor',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'detectionState'
            }
          ],
          'proactivelyReported': this.reportState,
          'retrievable': true
        }
      }
    ]
  }

  /**
   * Get state
   */
  async getState () {
    const parentState = await super.getState()
    if (this.shadow.open === undefined) {
      this.shadow.open = false
    }
    parentState.push({
      'namespace': 'Alexa.ContactSensor',
      'name': 'detectionState',
      'value': this.shadow.open ? 'DETECTED' : 'NOT_DETECTED',
      'timeOfSample': this.timeOfSample,
      'uncertaintyInMilliseconds': this.uncertaintyInMilliseconds
    })
    return parentState
  }
}
