const Switch = require('./Switch')

/**
 * Fan Device
 */
module.exports = class Fan extends Switch {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.FAN'
  }

  /**
   * Get capabilities
   *
   * @returns {String[]}
   */
  getCapabilities () {
    return [
      ...super.getCapabilities(),
      'action.devices.traits.FanSpeed'
    ]
  }

  /**
   * Get state
   */
  async getState () {
    const parentState = await super.getState()
    if (this.shadow.speed === undefined || this.shadow.speed === null) {
      this.shadow.speed = this.getSpeeds()[0]
    }
    return Object.assign(parentState, {
      currentFanSpeedSetting: this.shadow.speed
    })
  }

  /**
   * attributes
   *
   * @return {Object}
   */
  getAttributes () {
    return {
      availableFanSpeeds: {
        speeds: this.getSpeeds().map((speed) => ({
          speed_name: speed,
          speed_values: []
        })),
        ordered: this.attributes.ordered === 'true' || false
      },
      reversible: this.attributes.ordered === 'true' || true
    }
  }

  /**
   * Get speeds
   *
   * @returns {Array}
   */
  getSpeeds () {
    const speeds = this.attributes.speeds || ''
    return speeds.split(',').filter(value => value.trim() !== '').map(value => value.replace('_', ' '))
  }
}
