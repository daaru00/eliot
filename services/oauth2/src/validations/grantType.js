const createError = require('http-errors')

/**
 * Grant Type validation
 *
 */
module.exports = {
  before: async ({ event }) => {
    const grantType = event.body.grant_type

    if (grantType !== 'authorization_code' && grantType !== 'refresh_token') {
      throw new createError.BadRequest('invalid_grant')
    }
  }
}
