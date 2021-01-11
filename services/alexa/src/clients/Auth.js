const axios = require("axios")

/**
 * @property {axios} client
 */
class Auth {
  /**
   * Constructor
   * 
   * @param {string} endpoint
   */
  constructor (endpoint) {
    endpoint = endpoint || process.env.OAUTH2_ENDPOINT_URL
    this.client = axios.default.create({
      baseURL: endpoint
    })
  }

  /**
   * Check if token is valid
   * 
   * @param {string} token 
   * @returns {boolean}
   */
  async isTokenValid (token) {
    try {
      const { status } = await this.client.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return status === 200
    } catch (err) {
      console.error(err)
      return false
    }
  }

}

module.exports = Auth
