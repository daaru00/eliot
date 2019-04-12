const AbstractModel = require('../../common/models/AbstractModel')
const randomstring = require('randomstring')

class AuthCode extends AbstractModel {
  /**
   * Generate tokens
   *
   * @returns {String}
   */
  async generate () {
    const authCode = randomstring.generate(7)
    const createdAt = new Date().getTime()
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
