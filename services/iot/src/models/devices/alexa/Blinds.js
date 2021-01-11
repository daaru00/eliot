const BaseAlexaDevice = require('../../BaseAlexaDevice')

/**
 * Blinds Device
 */
module.exports = class Blinds extends BaseAlexaDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'INTERIOR_BLIND'
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
        'interface': 'Alexa.ModeController',
        'instance': 'Blinds.Position',
        'version': '3',
        'properties': {
          'supported': [
            {
              'name': 'mode'
            }
          ],
          'proactivelyReported': this.reportState,
          'retrievable': true
        },
        'stateMappings': [
          {
            '@type': 'StatesToValue',
            'states': ['Alexa.States.Closed'],
            'value': 'Position.Down'
          },
          {
            '@type': 'StatesToValue',
            'states': ['Alexa.States.Open'],
            'value': 'Position.Up'
          }  
        ]
      }
    ]
  }

  /**
   * Get state
   */
  async getState () {
    const parentState = await super.getState()
    if (this.shadow.open === undefined || this.shadow.open === null) {
      this.shadow.open = false
    }
    parentState.push({
      'instance': 'Blinds.Position',
      'name': 'mode',
      'value': this.shadow.open ? 'Position.Up' : 'Position.Down',
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
    case 'Alexa.ModeController.SetMode':
      if (payload.mode === 'Position.Up') {
        this.shadow.open = true
      } else if (payload.mode === 'Position.Down') {
        this.shadow.open = true
      }
      await this.saveShadow()
      return true
    }

    return false
  }
}
