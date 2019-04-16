/**
 * Error handler
 */
module.exports = {
  onError: async (handler) => {
    let payload = {
      'type': 'INTERNAL_ERROR',
      'message': 'An internal error occured'
    }
    if (handler.error.statusCode === 400) {
      payload = {
        'type': 'INVALID_DIRECTIVE',
        'message': handler.error.message || 'Access token not found'
      }
    }
    if (handler.error.statusCode === 401) {
      payload = {
        'type': 'EXPIRED_AUTHORIZATION_CREDENTIAL',
        'message': handler.error.message || 'Access token not found'
      }
    }
    if (handler.error.statusCode === 404) {
      payload = {
        'type': 'NO_SUCH_ENDPOINT',
        'message': handler.error.message || 'Entity not found'
      }
    }

    const directive = handler.event.directive
    const header = directive.header
    header.namespace = 'Alexa'
    header.name = 'ErrorResponse'
    handler.response = {
      event: {
        header,
        endpoint: directive.endpoint,
        payload
      }
    }
  }
}
