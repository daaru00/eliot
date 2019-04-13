/**
 * Log request and response
 */
module.exports = {
  before: async (handler) => {
    console.debug('event', JSON.stringify(handler.event))
  },
  after: async (handler) => {
    console.debug('response', JSON.stringify(handler.response))
  },
  onError: async (handler) => {
    if (handler.error) {
      console.error('error', handler.error)
    }
    console.error('response', JSON.stringify(handler.response))
  }
}
