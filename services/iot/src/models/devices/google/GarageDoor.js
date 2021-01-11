const BaseGoogleDevice = require('../../BaseGoogleDevice')

/**
 * Switch Device
 */
module.exports = class Garage extends BaseGoogleDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.GARAGE'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      'action.devices.traits.OpenClose'
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
    return Object.assign(parentState, {
      openPercent: this.shadow.open ? 100 : 0
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
    case 'action.devices.commands.OpenClose':
      this.shadow.open = payload.open || false
      await this.saveShadow()
      return true
    }

    return false
  }
}
