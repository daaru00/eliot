const createError = require('http-errors')
const AccessToken = require('../models/AccessToken')

/**
 * API autentication
 *
 */
module.exports = {
  before: async (handler) => {
    let authorizationHeader

    if (handler.event.headers !== undefined) {
      authorizationHeader = handler.event.headers.Authorization
    } else if (
      handler.event.directive &&
      handler.event.directive.payload &&
      handler.event.directive.payload.grantee &&
      handler.event.directive.payload.grantee.type === 'BearerToken'
    ) {
      authorizationHeader = handler.event.directive.payload.grantee.token
    } else if (
      handler.event.directive &&
      handler.event.directive.endpoint &&
      handler.event.directive.endpoint.scope &&
      handler.event.directive.endpoint.scope.type === 'BearerToken'
    ) {
      authorizationHeader = handler.event.directive.endpoint.scope.token
    }

    if (authorizationHeader === undefined || authorizationHeader.trim().length === 0) {
      throw createError.Unauthorized()
    }

    const accessToken = authorizationHeader.replace('Bearer ', '').toString()
    if (accessToken.length !== 40 || await AccessToken.verify(accessToken) === false) {
      throw createError.Unauthorized()
    }
  }
}
