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
   */
  constructor ({ thingName, thingArn, attributes }) {
    this.name = thingName
    this.arn = thingArn
    this.attributes = attributes
    this.dataClient = undefined
    this.shadow = undefined
    this.reportState = false
    this.timeOfSample = new Date().toJSON()
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
    let response = {}
    try {
      response = await dataClient.getThingShadow({
        thingName: this.name
      }).promise()
    } catch (err) {
      if (err.code === 'ResourceNotFoundException') {
        console.error(err.message)
      } else {
        throw err
      }
    }
    let payload = JSON.parse(response.payload || '{}')
    payload.state = payload.state || {}
    payload.state.reported = payload.state.reported || {}
    payload.metadata = payload.metadata || {}

    payload = payload || { state: { reported: {} }, metadata: { timestamp: new Date().getTime() / 1000 } }
    this.shadow = payload.state.reported || {}
    if (payload.metadata.timestamp !== undefined) {
      this.timeOfSample = new Date(payload.metadata.timestamp * 1000).toJSON()
    }
  }

  /**
   * Set shadow
   *
   * @param {Object} stateReported
   * @param {Number} timestamp
   */
  setShadow (stateReported, timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date()
    this.shadow = stateReported || {}
    this.timeOfSample = date.toJSON()
  }

  /**
   * Enrich device with shadow data
   *
   * @param {IotData} dataClient
   */
  async saveShadow (dataClient) {
    if (dataClient === undefined) {
      if (this.dataClient === undefined) {
        await this.init()
      }
      dataClient = this.dataClient
    }
    await dataClient.updateThingShadow({
      thingName: this.name,
      payload: JSON.stringify({
        state: {
          desired: this.shadow
        }
      })
    }).promise()
  }

  /**
   * Default description
   *
   * @returns {String}
   */
  getDescription () {
    return null
  }

  /**
   * Default state
   *
   * @returns {Object}
   */
  async getState () {
    await this.loadShadow()
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
    await this.loadShadow()
    return false
  }
}
