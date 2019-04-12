const AbstractModel = require('../../common/models/AbstractModel')
const randomstring = require('randomstring')

const TTL = 2592000 // 30 days
const LENGTH = 40

class AccessToken extends AbstractModel {
  /**
   * Generate access token
   *
   * @param {String} refreshToken
   * @returns {Object}
   */
  async generate (refreshToken) {
    const createdAt = new Date().getTime()
    const expiresIn = TTL
    const accessToken = randomstring.generate(LENGTH)
    await this.put({
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
      KeyConditionExpression: 'accessToken = :accessToken',
      ExpressionAttributeValues: {
        ':accessToken': accessToken
      }
    })
    return response.Items !== undefined && response.Items.length > 0
  }
}

module.exports = new AccessToken(process.env.TABLE_ACCESS_TOKENS)
