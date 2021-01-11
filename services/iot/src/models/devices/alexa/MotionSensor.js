const BaseAlexaDevice = require('../../BaseAlexaDevice')

/**
 * MotionSensor Device
 */
module.exports = class MotionSensor extends BaseAlexaDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'MOTION_SENSOR'
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
        'interface': 'Alexa.MotionSensor',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'detectionState'
            }
          ],
          'proactivelyReported': true,
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
    if (this.shadow.detected === undefined || this.shadow.detected === null) {
      this.shadow.detected = false
    }
    parentState.push({
      'namespace': 'Alexa.MotionSensor',
      'name': 'detectionState',
      'value': this.shadow.detected ? 'DETECTED' : 'NOT_DETECTED',
      'timeOfSample': this.timeOfSample,
      'uncertaintyInMilliseconds': this.uncertaintyInMilliseconds
    })
    return parentState
  }
}
