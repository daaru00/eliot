const BaseAlexaDevice = require('../../models/BaseAlexaDevice')

/**
 * Light Device
 */
module.exports = class Light extends BaseAlexaDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'LIGHT'
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
    await this.loadShadow()
    if (this.shadow.on === undefined || this.shadow.on === null) {
      this.shadow.on = false
    }
    return Object.assign(parentState, {
      powerState: this.shadow.on === true
    })
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
        return true
      case 'Alexa.PowerController.TurnOff':
        this.shadow.on = false
        return true
    }

    return false
  }
}
