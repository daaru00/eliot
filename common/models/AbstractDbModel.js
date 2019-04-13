const DynamoDB = require('aws-sdk/clients/dynamodb')
const documentClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

module.exports = class AbstractDbModel {
  /**
   * Model contructor
   *
   * @param {String} tableName
   */
  constructor (tableName) {
    this.tableName = tableName
  }

  /**
   * DyanamoDB query wrapper
   *
   * @param {Object} params
   * @param {String} index
   * @returns {Promise}
   */
  query (params) {
    params.TableName = this.tableName
    return documentClient.query(params).promise()
  }

  /**
   * DyanamoDB get wrapper
   *
   * @param {Object} keys
   * @returns {Promise}
   */
  get (keys) {
    return documentClient.get({
      TableName: this.tableName,
      Key: keys
    }).promise()
  }

  /**
   * DyanamoDB put wrapper
   *
   * @param {Object} item
   * @returns {Promise}
   */
  put (item) {
    return documentClient.put({
      TableName: this.tableName,
      Item: item
    }).promise()
  }

  /**
   * DyanamoDB delete wrapper
   *
   * @param {Object} keys
   * @returns {Promise}
   */
  delete (keys) {
    return documentClient.delete({
      TableName: this.tableName,
      Key: keys
    }).promise()
  }
}
