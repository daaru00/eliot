const got = require('got')
const RefreshToken = require('../../auth/models/RefreshToken')
const AccessToken = require('../../auth/models/AccessToken')

const TOKEN_ENDPOINT = 'https://api.amazon.com/auth/o2/token'
const ALEXA_CLIENT_ID = process.env.ALEXA_CLIENT_ID
const ALEXA_CLIENT_SECRET = process.env.ALEXA_CLIENT_SECRET

/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  const header = directive.header
  header.name = 'AcceptGrant.Response'

  if (
    ALEXA_CLIENT_ID &&
    ALEXA_CLIENT_SECRET &&
    directive.payload.grant &&
    directive.payload.grant.type === 'OAuth2.AuthorizationCode'
  ) {
    let response
    try {
      response = await got.post(TOKEN_ENDPOINT, {
        form: true,
        body: {
          grant_type: 'authorization_code',
          code: directive.payload.grant.code,
          client_id: ALEXA_CLIENT_ID,
          client_secret: ALEXA_CLIENT_SECRET
        }
      })
    } catch (e) {
      console.error(e)
      throw e
    }
    console.log('athorization response', response.body)
    response = JSON.parse(response.body)
    await Promise.all([
      RefreshToken.provider('alexa').store(response.refresh_token),
      AccessToken.provider('alexa').store(response.access_token, response.refresh_token, response.expires_in)
    ])
  }

  return {
    event: {
      header: header,
      payload: {}
    }
  }
}
