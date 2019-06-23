/**
 * Mocked AWS IoT
 */
module.exports = class Iot {
  updateThingShadow (params) {
    return {
      promise: () => Promise.resolve()
    }
  }
}
