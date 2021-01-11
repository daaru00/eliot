const createError = require('http-errors')

/**
 * Client ID validation
 *
 */
module.exports = {
  before: async ({ event }) => {
    console.log(event);
    const clientId = event.queryStringParameters.client_id || event.body.client_id

    if (clientId !== process.env.CLIENT_ID) {
      throw new createError.Unauthorized('invalid_client_id')
    }
  }
}
