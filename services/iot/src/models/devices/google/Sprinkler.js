const BaseGoogleDevice = require('../../BaseGoogleDevice')

/**
 * Sprinkler Device
 */
module.exports = class Sprinkler extends BaseGoogleDevice {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.SPRINKLER'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      'action.devices.traits.StartStop'
    ]
  }

  /**
   * Get state
   */
  async getState () {
    const parentState = await super.getState()
    if (this.shadow.running === undefined || this.shadow.running === null) {
      this.shadow.running = false
    }
    if (this.shadow.paused === undefined || this.shadow.paused === null) {
      this.shadow.paused = false
    }
    if (this.shadow.zones === undefined || this.shadow.zones === null) {
      this.shadow.zones = this.getZones()
    } else if (Array.isArray(this.shadow.zones) === false) {
      this.shadow.zones = [ this.shadow.zones.toString() ]
    }
    return Object.assign(parentState, {
      isRunning: this.shadow.running,
      isPaused: this.shadow.paused,
      activeZones: this.shadow.zones
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
    case 'action.devices.commands.StartStop':
      this.shadow.running = payload.start || false
      if (payload.zone) {
        this.shadow.zones = [payload.zone]
      }
      await this.saveShadow()
      return true
    case 'action.devices.commands.PauseUnpause':
      this.shadow.on = payload.pause || false
      await this.saveShadow()
      return true
    }

    return false
  }

  /**
   * attributes
   *
   * @return {Object}
   */
  getAttributes () {
    return {
      pausable: this.attributes.pausable === 'true',
      availableZones: this.getZones()
    }
  }

  /**
   * Get available zones
   *
   * @returns {Array}
   */
  getZones () {
    const zones = this.attributes.zones || ''
    return zones.split(',').filter(value => value.trim() !== '').map(value => value.replace('_', ' '))
  }
}
