const BaseAlexaDevice = require('../../BaseAlexaDevice')

/**
 * Lock Device
 */
module.exports = class Lock extends BaseAlexaDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'SMARTLOCK'
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
        'interface': 'Alexa.LockController',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'lockState'
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
    if (this.shadow.locked === undefined || this.shadow.locked === null) {
      this.shadow.locked = false
    }
    parentState.push({
      'namespace': 'Alexa.LockController',
      'name': 'lockState',
      'value': this.shadow.locked ? 'LOCKED' : 'UNLOCKED',
      'timeOfSample': this.timeOfSample,
      'uncertaintyInMilliseconds': this.uncertaintyInMilliseconds
    })
    return parentState
  }

  /**
   * Execute command
   *
   * @param {String} command
   * @param {Object} payload
   * @returns {Boolean}
   */
  async execute (command, payload) {
    if (await super.execute(command, payload)) {
      return true
    }

    switch (command) {
    case 'Alexa.LockController.Lock':
      this.shadow.locked = true
      await this.saveShadow()
      return true
    case 'Alexa.LockController.Unlock':
      this.shadow.locked = false
      await this.saveShadow()
      return true
    }

    return false
  }
}
