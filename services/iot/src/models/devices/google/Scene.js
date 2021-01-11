const BaseGoogleDevice = require('../../BaseGoogleDevice')

/**
 * Switch Device
 */
module.exports = class Switch extends BaseGoogleDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.SCENE'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      'action.devices.traits.Scene'
    ]
  }

  /**
   * attributes
   *
   * @return {Object}
   */
  getAttributes () {
    return {
      sceneReversible: this.attributes.sceneReversible === 'true' || false,
    }
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
    case 'action.devices.commands.ActivateScene':
      if (payload.deactivate === false) {
        this.shadow.active = true
      } else {
        this.shadow.active = false
      }
      await this.saveShadow()
      return true
    }

    return false
  }
}
