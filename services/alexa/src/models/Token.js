/**
 * DynamoDB data mapper
 */
const { DataMapper, DynamoDbSchema, DynamoDbTable} = require('@aws/dynamodb-data-mapper')
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
   * Retrieve refresh token
   *
   * @param {boolean} ignoreExpires
   * @returns {Token}
   */
  async retrieve (ignoreExpires = false) {
    // Prepare filters
    const opts = {}
    if (!ignoreExpires) {
      opts.filter = {}
      opts.filter.type = 'GreaterThan'
      opts.filter.object = Math.floor(new Date().getTime() / 1000)
      opts.filter.subject = 'ttl'
    }

    // Execute get
    try {
      /** @type {Token[]} */
      const results = mapper.query(Token, {
        type: this.type
      }, opts)

      // Only one access token at time is valid, two async request can retrieve a new access token in same time
      let token = null
      for await (const result of results) {
        if (token === null) {
          token = result
          continue
        }
        if (result.ttl > token.ttl) {
          // delete old token
          await token.delete()
          token = result
        }
      }

      // returns token
      return token
    } catch (err) {
      console.log(err);
      return null
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
