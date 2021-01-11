const createError = require('http-errors')
const AuthClient = require('../clients/Auth')
const authClient = new AuthClient()

/**
 * Token validation
 */
module.exports = {
  before: async ({ event }) => {
    let accessToken

    if (
      event.directive &&
      event.directive.payload &&
      event.directive.payload.grantee &&
      event.directive.payload.grantee.type === 'BearerToken'
    ) {
      accessToken = event.directive.payload.grantee.token
    } else if (
      event.directive &&
      event.directive.endpoint &&
      event.directive.endpoint.scope &&
      event.directive.endpoint.scope.type === 'BearerToken'
    ) {
      accessToken = event.directive.endpoint.scope.token
    } else if (
      event.directive &&
      event.directive.payload &&
      event.directive.payload.scope &&
      event.directive.payload.scope.type === 'BearerToken'
    ) {
      accessToken = event.directive.payload.scope.token
    }

    if (accessToken === undefined || accessToken.trim().length === 0) {
      throw new createError.Unauthorized('token_not_found')
    }

    if (await authClient.isTokenValid(accessToken) === false) {
      throw new createError.Unauthorized('invalid_token')
    }
  }
}
