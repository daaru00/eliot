const BaseGoogleDevice = require('../../models/BaseGoogleDevice')

/**
 * Light Device
 */
module.exports = class Light extends BaseGoogleDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.LIGHT'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      'action.devices.traits.OnOff'
    ]
  }

  /**
   * Get state
   */
  async getState () {
    await this.loadShadow()
    const parentState = await super.getState()
    if (this.shadow.on === undefined || this.shadow.on === null) {
      this.shadow.on = false
    }
    return Object.assign(parentState, {
      on: this.shadow.on === true
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
      case 'action.devices.commands.OnOff':
        this.shadow.on = payload.on || false
        await this.saveShadow()
        return true
    }

    return false
  }
}
