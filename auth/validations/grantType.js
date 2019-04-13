const createError = require('http-errors')

/**
 * Grant Type validation
 *
 */
module.exports = {
  before: async (handler) => {
    const grantType = handler.event.body.grant_type

    if (grantType !== 'authorization_code' && grantType !== 'refresh_token') {
      throw createError(400, 'invalid_grant')
    }
  }
}
