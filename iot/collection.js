const Iot = require('aws-sdk/clients/iot')
const IotData = require('aws-sdk/clients/iotdata')
const iot = new Iot({ apiVersion: '2015-05-28' })
// eslint-disable-next-line no-unused-vars
const BaseDevice = require('./models/BaseDevice')
const deviceFactory = require('./devices/factory')

const CONCURRENT_SHADOW_GET = 5

/**
 * IoT Collection
 */
class IoTCollection {
  /**
   * Constructor
   */
  constructor () {
    this.dataClient = undefined
    this.devices = []
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
   * List IoT Things
   *
   * @param {String} provider
   * @returns {BaseDevice[]}
   */
  async list (provider) {
    this.devices = []
    let response = {}
    do {
      response = await iot.listThings({
        attributeName: 'sync',
        attributeValue: 'enable',
        maxResults: 250
      }).promise()
      this.devices = this.devices.concat(
        response.things.map(thing => deviceFactory(provider, thing.attributes.type, thing).getDescription())
      )
    } while (response.nextToken !== null)
    return this.devices
  }

  /**
   * Load all devices shadow
   */
  async loadDevicesShadow () {
    if (this.dataClient === undefined) {
      await this.init()
    }
    let chunk = []
    const length = this.devices.length
    if (length === 0) {
      return
    }
    for (let i = 0; i < length; i += CONCURRENT_SHADOW_GET) {
      chunk = this.devices.slice(i, i + CONCURRENT_SHADOW_GET)
      await Promise.all(chunk.map((device) => device.loadShadow(this.dataClient)))
    }
  }

  /**
   * Load a single devices
   */
  async loadSingleDevice (provider, id) {
    if (this.dataClient === undefined) {
      await this.init()
    }
    const thing = await iot.describeThing({
      thingName: id
    }).promise()
    if (thing === null) {
      return null
    }
    return deviceFactory(provider, thing.attributes.type, thing)
  }
}

module.exports = new IoTCollection()
