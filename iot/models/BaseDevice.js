const Iot = require('aws-sdk/clients/iot')
const IotData = require('aws-sdk/clients/iotdata')
const iot = new Iot({ apiVersion: '2015-05-28' })

/**
 * IoT Device
 */
module.exports = class BaseDevice {
  /**
   * Constructor
   *
   * @param {Object} iotThing
   * @param {Object} endpoint
   */
  constructor ({ thingName, thingArn, attributes }) {
    this.name = thingName
    this.arn = thingArn
    this.attributes = attributes
    this.dataClient = undefined
    this.shadow = undefined
    this.reportState = false // TODO: when notification will be enabled
  }

  /**
   * Perform initialization
   */
  async init () {
    const endpoint = await iot.describeEndpoint({
      endpointType: 'iot:Data'
    }).promise()
    this.dataClient = new IotData({ endpoint: endpoint.endpointAddress })
  }

  /**
   * Enrich device with shadow data
   *
   * @param {IotData} dataClient
   */
  async loadShadow (dataClient) {
    if (this.shadow !== undefined) {
      return
    }
    if (dataClient === undefined) {
      if (this.dataClient === undefined) {
        await this.init()
      }
      dataClient = this.dataClient
    }
    const response = await dataClient.getThingShadow().promise()
    this.shadow = response.payload
  }

  /**
   * Default description
   */
  getDescription () {
    return {}
  }

  /**
   * Default state
   */
  async getState () {
    return {}
  }

  /**
   * Default execute command
   *
   * @param {String} command
   * @param {Object} payload
   * @returns {Boolean}
   */
  async execute (command, payload) {
    return false
  }
}
