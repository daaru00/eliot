const randomString = require('randomstring')
/**
 * DynamoDB data mapper
 */
const { DataMapper, DynamoDbSchema, DynamoDbTable} = require('@aws/dynamodb-data-mapper')
const DynamoDbExpressions = require('@aws/dynamodb-expressions')
const DynamoDB = require('aws-sdk/clients/dynamodb')
const mapper = new DataMapper({
  client: new DynamoDB({
    logger: console
  })
});

/**
 * OAuth2 access tokens class
 * 
 * @property {string} type
 * @property {string} value
 * @property {number} ttl
 * @property {number} expiresIn
 */
class Token {

  get [DynamoDbTable] () {
    return process.env.TOKENS_TABLE_NAME
  }

  get [DynamoDbSchema] () {
    return {
      type: {
        type: 'String',
        keyType: 'HASH'
      },
      value: {
        type: 'String',
        keyType: 'RANGE'
      },
      ttl: {
        type: 'Number'
      },
      expiresIn: {
        type: 'Number'
      }
    }
  }

  /**
   * Constructor
   * 
   * @param {string} type 
   */
  constructor (type) {
    this.type = type
  }

  /**
   * Generate a new token
   *
   * @param {object} opts
   * @param {number} opts.length
   * @param {number|null} opts.ttl in seconds, example: 2592000 for 30 days
   */
  generate ({ length = 40, ttl = null }) {
    this.value = randomString.generate(length)
    if (ttl !== null) {
      const createdAt = Math.floor(new Date().getTime() / 1000)
      this.ttl = createdAt + ttl
      this.expiresIn = ttl
    }
  }

  /**
   * Verify token
   *
   * @param {string} token
   * @param {boolean} ignoreExpires
   * @returns {boolean}
   */
  async verify (token, ignoreExpires = false) {
    // Prepare filters
    const filter = {}
    if (!ignoreExpires) {
      const now = Math.floor(new Date().getTime() / 1000)
      filter.ttl = DynamoDbExpressions.greaterThan(now)
    }

    // Execute get
    try {
      const stored = await mapper.get(
        Object.assign(
          new Token, 
          {
            type: this.type, 
            value: token, 
          }),
        {
          filter,
        }
      )

      // Set internal values
      this.type = stored.type
      this.value = stored.value
      this.expiresIn = stored.expiresIn
      this.ttl = stored.ttl
      
      // Check item count
      return true
    } catch (err) {
      console.log(err);
      return false
    }
  } 

  /**
   * Save model instance to database
   */
  async save () {
    await mapper.put(this)
  }

  /**
   * Delete model instance from database
   */
  async delete () {
    await mapper.delete(this)
  }

}

module.exports = Token
