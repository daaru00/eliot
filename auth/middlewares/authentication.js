const createError = require('http-errors')
const AccessToken = require('../models/AccessToken')

/**
 * API autentication
 *
 */
module.exports = {
  before: async (handler) => {
    const authorizationHeader = handler.event.headers.Authorization

    if (authorizationHeader === undefined || authorizationHeader.trim().length === 0) {
      throw createError.Unauthorized()
    }

    const accessToken = authorizationHeader.replace('Bearer ', '').toString()
    if (accessToken.length !== 40 || await AccessToken.verify(accessToken) === false) {
      throw createError.Unauthorized()
    }
  }
}
