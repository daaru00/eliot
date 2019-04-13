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
  constructor ({ thingName, thingArn, attributes }, endpointAddress) {
    this.name = thingName
    this.arn = thingArn
    this.attributes = attributes
    this.endpoint = endpointAddress
    this.dataClient = undefined
    this.isShadowLoaded = false
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
    if (this.isShadowLoaded === true) {
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
    this.isShadowLoaded = true
  }
}
