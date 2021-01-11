const Switch = require('./Switch')

/**
 * Light Device
 */
module.exports = class Outlet extends Switch {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'action.devices.types.OUTLET'
  }
}
