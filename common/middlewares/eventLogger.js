/**
 * Log request and response
 */
module.exports = {
  before: async handler => {
    /* eslint-disable no-console */
    console.debug('event', JSON.stringify(handler.event))
  },
  after: async handler => {
    /* eslint-disable no-console */
    console.debug('response', JSON.stringify(handler.response))
  },
  onError: (handler, next) => {
    if (handler.error) {
      /* eslint-disable no-console */
      console.error('error', handler.error)
    }
    /* eslint-disable no-console */
    console.debug('response', JSON.stringify(handler.response))
    return next(handler.error)
  }
}
