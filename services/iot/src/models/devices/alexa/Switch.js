const BaseAlexaDevice = require('../../BaseAlexaDevice')

/**
 * Switch Device
 */
module.exports = class Switch extends BaseAlexaDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'SWITCH'
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
        'interface': 'Alexa.PowerController',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'powerState'
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
    if (this.shadow.on === undefined || this.shadow.on === null) {
      this.shadow.on = false
    }
    parentState.push({
      'namespace': 'Alexa.PowerController',
      'name': 'powerState',
      'value': this.shadow.on ? 'ON' : 'OFF',
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
    case 'Alexa.PowerController.TurnOn':
      this.shadow.on = true
      await this.saveShadow()
      return true
    case 'Alexa.PowerController.TurnOff':
      this.shadow.on = false
      await this.saveShadow()
      return true
    }

    return false
  }
}
