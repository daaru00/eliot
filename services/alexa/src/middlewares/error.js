/**
 * Error handler
 */
module.exports = {
  onError: (handler, next) => {
    const directive = handler.event.directive
    const header = directive.header

    if (!directive || !handler) {
      return next(handler.error)
    }

    // Log error

    console.error(handler.error);

    // Setup payload

    let payload = {
      'type': 'INTERNAL_ERROR',
      'message': handler.error.message || 'An internal error occurred'
    }

    switch (handler.error.statusCode ) {
    case 400:
      payload = {
        'type': 'INVALID_DIRECTIVE',
        'message': handler.error.message || 'Invalid directive'
      }
      break;
    case 401:
      payload = {
        'type': 'EXPIRED_AUTHORIZATION_CREDENTIAL',
        'message': handler.error.message || 'Access token not found'
      }
      break;
    case 404:
      payload = {
        'type': 'NO_SUCH_ENDPOINT',
        'message': handler.error.message || 'Entity not found'
      }
      break;
    }

    // Set headers

    header.namespace = 'Alexa'
    header.name = 'ErrorResponse'

    // Set response
    
    handler.response = {
      event: {
        header,
        endpoint: directive.endpoint,
        payload
      }
    }

    return next()
  }
}
