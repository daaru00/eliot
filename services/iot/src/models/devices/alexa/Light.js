const Switch = require('./Switch')

/**
 * Light Device
 */
module.exports = class Light extends Switch {
  /**
   * Get Type
   *
   * @return {String}
   */
  getType () {
    return 'LIGHT'
  }
}
