const createError = require('http-errors')
const AccessToken = require('../../auth/models/AccessToken')

/**
 * Token validation
 */
module.exports = {
  before: async (handler) => {
    let accessToken

    if (
      handler.event.directive &&
      handler.event.directive.payload &&
      handler.event.directive.payload.grantee &&
      handler.event.directive.payload.grantee.type === 'BearerToken'
    ) {
      accessToken = handler.event.directive.payload.grantee.token
    } else if (
      handler.event.directive &&
      handler.event.directive.endpoint &&
      handler.event.directive.endpoint.scope &&
      handler.event.directive.endpoint.scope.type === 'BearerToken'
    ) {
      accessToken = handler.event.directive.endpoint.scope.token
    } else if (
      handler.event.directive &&
      handler.event.directive.payload &&
      handler.event.directive.payload.scope &&
      handler.event.directive.payload.scope.type === 'BearerToken'
    ) {
      accessToken = handler.event.directive.payload.scope.token
    }

    if (accessToken === undefined || accessToken.trim().length === 0) {
      throw createError.Unauthorized()
    }

    if (accessToken.length !== 40 || await AccessToken.verify(accessToken) === false) {
      throw createError.Unauthorized()
    }
  }
}
