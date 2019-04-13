/**
 * HTTP transformer
 */
module.exports = {
  before: async (handler) => {
    if (handler.event.httpMethod === undefined) {
      return
    }

    const body = handler.event.body ? JSON.parse(handler.event.body) : {}
    handler.event.directive = body.directive
  },
  after: async (handler) => {
    if (handler.event.httpMethod === undefined) {
      return
    }

    handler.response = {
      statusCode: 200,
      body: JSON.stringify(handler.response)
    }
  },
  onError: async (handler) => {
    if (handler.event.httpMethod === undefined) {
      return
    }

    handler.response = {
      statusCode: handler.error.statusCode,
      body: handler.error.message
    }
  }
}
