const axios = require("axios")
const qs = require('querystring')
const Token = require('../models/Token')

const TOKEN_ENDPOINT = 'https://api.amazon.com/auth/o2/token'

class AlexaTokens {

  /**
   * Constructor
   */
  constructor() {
    this.refreshToken = new Token('refresh-token')
    this.accessToken = new Token('access-token')    
  }

  /**
   * Get current access token
   * 
   * @returns {string|null}
   */
  async getAccessToken() {
    const token = await this.accessToken.retrieve()
    if (token !== null) {
      return token.value
    }
    return await this.retrieveNewAccessToken()
  }

  /**
   * Exchange auth code with tokens
   * 
   * @param {string} authCode
   */
  async retrieveTokens(authCode) {
    let { data } = await axios.post(TOKEN_ENDPOINT, qs.stringify({
      grant_type: 'authorization_code',
      code: authCode,
      client_id: process.env.ALEXA_CLIENT_ID,
      client_secret: process.env.ALEXA_CLIENT_SECRET
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    console.log('authorization response', data)

    // Save new refresh token
    this.refreshToken.value = data.refresh_token
    await this.refreshToken.save()

    // Save new access token
    this.accessToken.value = data.access_token
    const createdAt = Math.floor(new Date().getTime() / 1000)
    this.accessToken.ttl = createdAt + data.expires_in
    await this.accessToken.save()
  }

  /**
   * Ask new access token
   * 
   * @returns {string|null}
   */
  async retrieveNewAccessToken() {
    const found = await this.refreshToken.retrieve(true)
    if (!found) {
      return null
    }
    let { data } = await axios.post(TOKEN_ENDPOINT, qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: found.value,
      client_id: process.env.ALEXA_CLIENT_ID,
      client_secret: process.env.ALEXA_CLIENT_SECRET
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    // Save new access token
    this.accessToken.value = data.access_token
    const createdAt = Math.floor(new Date().getTime() / 1000)
    this.accessToken.ttl = createdAt + data.expires_in
    await this.accessToken.save()

    // Return new access token
    return this.accessToken.value
  }

}

module.exports = AlexaTokens
