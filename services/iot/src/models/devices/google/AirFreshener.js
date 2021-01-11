const Switch = require('./Switch')

/**
 * AirFreshener Device
 */
module.exports = class AirFreshener extends Switch {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.AIRFRESHENER'
  }
}
