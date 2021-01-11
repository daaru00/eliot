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
    return 'SCENE_TRIGGER'
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
        'interface': 'Alexa.SceneController',
        'version': '3',
        'supportsDeactivation': this.attributes.sceneReversible === 'true' || false
      }
    ]
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
    case 'Alexa.SceneController.Activate':
      this.shadow.active = true
      await this.saveShadow()
      return true
    case 'Alexa.SceneController.Deactivate':
      this.shadow.active = false
      await this.saveShadow()
      return true
    }

    return false
  }
}
