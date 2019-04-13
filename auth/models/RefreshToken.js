const AbstractDbModel = require('../../common/models/AbstractDbModel')
const randomstring = require('randomstring')

const LENGTH = 40

class RefreshToken extends AbstractDbModel {
  /**
   * Generate tokens
   *
   * @returns {String}
   */
  async generate () {
    const createdAt = new Date().getTime()
    const refreshToken = randomstring.generate(LENGTH)
    await this.put({
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
      refreshToken
    })
    return response.Item !== undefined
  }
}

module.exports = new RefreshToken(process.env.TABLE_REFRESH_TOKENS)
