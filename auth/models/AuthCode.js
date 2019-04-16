const AbstractDbModel = require('../../common/models/AbstractDbModel')
const randomstring = require('randomstring')

const LENGTH = 7

class AuthCode extends AbstractDbModel {
  /**
   * Generate tokens
   *
   * @returns {String}
   */
  async generate () {
    const authCode = randomstring.generate(LENGTH)
    const createdAt = Math.floor(new Date().getTime() / 1000)
    await this.put({
      authCode,
      createdAt,
      ttl: createdAt + 1800 // 30 minutes
    })
    return authCode
  }

  /**
   * Verify authCode
   *
   * @param {String} authCode
   * @returns {Boolean}
   */
  async verify (authCode) {
    const response = await this.get({
      authCode
    })
    return response.Item !== undefined
  }

  /**
   * Destroy authCode
   *
   * @param {String} authCode
   */
  async destroy (authCode) {
    await this.delete({
      authCode
    })
  }
}

module.exports = new AuthCode(process.env.TABLE_AUTH_CODES)
