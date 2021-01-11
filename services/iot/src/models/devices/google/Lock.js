const BaseGoogleDevice = require('../../BaseGoogleDevice')

/**
 * Switch Device
 */
module.exports = class Lock extends BaseGoogleDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.Lock'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      'action.devices.traits.LockUnlock'
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
    if (this.shadow.jammed === undefined || this.shadow.jammed === null) {
      this.shadow.jammed = false
    }
    return Object.assign(parentState, {
      isLocked: this.shadow.locked,
      isJammed: this.shadow.jammed,
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
    case 'action.devices.commands.LockUnlock':
      this.shadow.locked = payload.locked || false
      await this.saveShadow()
      return true
    }

    return false
  }
}
