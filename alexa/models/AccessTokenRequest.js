const got = require('got')
const RefreshToken = require('../../auth/models/RefreshToken')
const AccessToken = require('../../auth/models/AccessToken')

const ALEXA_CLIENT_ID = process.env.ALEXA_CLIENT_ID
const ALEXA_CLIENT_SECRET = process.env.ALEXA_CLIENT_SECRET
const TOKEN_ENDPOINT = 'https://api.amazon.com/auth/o2/token'

class AccessTokenRequest {
  /**
   * Ask new access token and store it
   */
  async ask () {
    const refreshToken = await RefreshToken.provider('alexa').retrieve()
    if (refreshToken === null) {
      return null
    }
    let response = await got.post(TOKEN_ENDPOINT, {
      form: true,
      body: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: ALEXA_CLIENT_ID,
        client_secret: ALEXA_CLIENT_SECRET
      }
    })
    response = JSON.parse(response.body)
    console.log('athorization response', response)
    await AccessToken.provider('alexa').store(response.access_token, response.refresh_token, response.expires_in)
    return response.access_token
  }
}

module.exports = new AccessTokenRequest()
