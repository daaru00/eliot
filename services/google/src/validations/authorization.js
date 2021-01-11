const createError = require('http-errors')
const AuthClient = require('../clients/Auth')
const authClient = new AuthClient()

/**
 * Authorization validation
 *
 */
module.exports = {
  before: async ({ event }) => {
    const accessToken = event.headers.authorization || event.headers.Authorization

    if (await authClient.isTokenValid(accessToken) === false) {
      throw new createError.Unauthorized('invalid_authorization')
    }
  }
}
