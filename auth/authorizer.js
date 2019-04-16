const middy = require('middy')
const loggerMiddleware = require('../common/middlewares/eventLogger')

/**
 * Models
 */
const AccessToken = require('./models/AccessToken')

/**
 * Token check
 *
 * @param {Object} event
 */
const checkAuthorizationToken = {
  before: async (handler) => {
    const authorizationToken = handler.event.authorizationToken
    if (authorizationToken === undefined || authorizationToken === null || authorizationToken.trim().length === 0) {
      handler.callback('invalid_grant')
    }

    const accessToken = authorizationToken.replace('Bearer ', '')
    if (accessToken.length !== 40 || await AccessToken.verify(accessToken) === false) {
      handler.callback('invalid_grant')
    }
  }
}

/**
 * Lambda handler
 *
 * @param {Object} event
 */
const generatePolicy = async (event) => ({
  principalId: 'user',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: event.methodArn
    }]
  }
})

const handler = middy(generatePolicy)
  .use(loggerMiddleware)
  .use(checkAuthorizationToken)

module.exports = { handler }
