const Switch = require('./Switch')

/**
 * Plug Device
 */
module.exports = class Plug extends Switch {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'SMARTPLUG'
  }
}
