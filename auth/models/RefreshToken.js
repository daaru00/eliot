const AbstractDbModel = require('../../common/models/AbstractDbModel')
const randomstring = require('randomstring')

const LENGTH = 40
const DEFAULT_PROVIDER = 'eliot'

class RefreshToken extends AbstractDbModel {
  /**
   * Use a specific provider
   *
   * @param {String} provider
   * @returns {AccessToken}
   */
  provider (provider) {
    this.providerName = provider
    return this
  }

  /**
   * Generate tokens
   *
   * @returns {String}
   */
  async generate () {
    const createdAt = Math.floor(new Date().getTime() / 1000)
    const refreshToken = randomstring.generate(LENGTH)
    await this.put({
      provider: this.providerName || DEFAULT_PROVIDER,
      refreshToken,
      createdAt
    })
    return refreshToken
  }

  /**
   * Verify refresh token
   *
   * @param {String} refreshToken
   * @returns {Boolean}
   */
  async verify (refreshToken) {
    const response = await this.get({
      provider: this.providerName || DEFAULT_PROVIDER,
      refreshToken
    })
    return response.Item !== undefined
  }

  /**
   * Store refresh token
   *
   * @param {String} refreshToken
   */
  async store (refreshToken) {
    const createdAt = Math.floor(new Date().getTime() / 1000)
    await this.put({
      provider: this.providerName || DEFAULT_PROVIDER,
      refreshToken,
      createdAt
    })
  }

  /**
   * Retrieve refresh token
   *
   * @returns {String}
   */
  async retrieve () {
    const response = await this.query({
      KeyConditionExpression: 'provider = :provider',
      ExpressionAttributeValues: {
        ':provider': this.providerName || DEFAULT_PROVIDER
      }
    })
    return (
      response.Items !== undefined &&
      Array.isArray(response.Items) &&
      response.Items.length > 0
    ) ? response.Items[0].refreshToken : null
  }
}

module.exports = new RefreshToken(process.env.TABLE_REFRESH_TOKENS)
