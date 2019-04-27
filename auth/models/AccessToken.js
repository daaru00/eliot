const AbstractDbModel = require('../../common/models/AbstractDbModel')
const randomstring = require('randomstring')

const TTL = 2592000 // 30 days
const LENGTH = 40
const DEFAULT_PROVIDER = 'eliot'

class AccessToken extends AbstractDbModel {
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
   * Generate access token
   *
   * @param {String} refreshToken
   * @returns {Object}
   */
  async generate (refreshToken) {
    const createdAt = Math.floor(new Date().getTime() / 1000)
    const expiresIn = TTL
    const accessToken = randomstring.generate(LENGTH)
    await this.put({
      provider: this.providerName || DEFAULT_PROVIDER,
      accessToken,
      refreshToken,
      createdAt,
      ttl: createdAt + expiresIn
    })
    return {
      accessToken,
      refreshToken,
      expiresIn
    }
  }

  /**
   * Verify access token
   *
   * @param {String} accessToken
   * @returns {Boolean}
   */
  async verify (accessToken) {
    const response = await this.query({
      KeyConditionExpression: 'provider = :provider AND accessToken = :accessToken',
      FilterExpression: '#ttl > :now',
      ExpressionAttributeValues: {
        ':provider': this.providerName || DEFAULT_PROVIDER,
        ':accessToken': accessToken,
        ':now': Math.floor(new Date().getTime() / 1000)
      },
      ExpressionAttributeNames: {
        '#ttl': 'ttl'
      }
    })
    return response.Items !== undefined && response.Items.length > 0
  }

  /**
   * Store access token
   *
   * @param {String} accessToken
   * @param {String} refreshToken
   * @param {Number} expiresIn
   */
  async store (accessToken, refreshToken, expiresIn) {
    const createdAt = Math.floor(new Date().getTime() / 1000)
    await this.put({
      provider: this.providerName || DEFAULT_PROVIDER,
      accessToken,
      refreshToken,
      createdAt,
      ttl: createdAt + expiresIn
    })
  }

  /**
   * Retrieve access token
   *
   * @returns {String}
   */
  async retrieve () {
    const response = await this.query({
      KeyConditionExpression: 'provider = :provider',
      FilterExpression: '#ttl > :now',
      ExpressionAttributeValues: {
        ':provider': this.providerName || DEFAULT_PROVIDER,
        ':now': Math.floor(new Date().getTime() / 1000)
      },
      ExpressionAttributeNames: {
        '#ttl': 'ttl'
      }
    })
    return (
      response.Items !== undefined &&
      Array.isArray(response.Items) &&
      response.Items.length > 0
    ) ? response.Items[0].accessToken : null
  }
}

module.exports = new AccessToken(process.env.TABLE_ACCESS_TOKENS)
