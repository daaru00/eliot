const Iot = require('aws-sdk/clients/iot')
const IotData = require('aws-sdk/clients/iotdata')
const iot = new Iot({ apiVersion: '2015-05-28' })

const mappingGoogleHomeTypes = require('../mapping/googleHome/types')
const mappingAlexaTypes = require('../mapping/alexa/types')
const mappingGoogleHomeCapabilities = require('../mapping/googleHome/capabilities')
const mappingAlexaCapabilities = require('../mapping/alexa/capabilities')

const MANUFACTURER = 'Eliot'
const DEFAULT_TYPE = 'Switch'

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
    this.decorated = {}
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

  /**
   * Default description
   */
  getDescription () {
    return {}
  }

  /**
   * Decorate device for Google Home
   *
   * @returns {Object}
   */
  decorateForGoogleHome () {
    this.decorated = {
      id: this.name,
      type: '',
      traits: [],
      name: {
        name: this.name,
        nicknames: this.attributes.nickname ? [this.attributes.nickname] : []
      },
      willReportState: false,
      roomHint: this.attributes.room || 'Cloud',
      attributes: {},
      deviceInfo: {
        manufacturer: MANUFACTURER,
        model: 'virtual',
        hwVersion: '1.0',
        swVersion: '1.0'
      },
      customData: {}
    }
    this.decorateTypeForGoogleHome()
    this.decorateCapabilitiesForGoogleHome()
    return this.decorated
  }

  /**
   * Decorate type for Google Home
   */
  decorateTypeForGoogleHome () {
    this.decorated = this.decorated || {}
    if (this.attributes.type === undefined) {
      this.attributes.type = DEFAULT_TYPE
    }
    for (const mapType in mappingGoogleHomeTypes) {
      if (mapType === this.attributes.type) {
        this.decorated.type = mappingGoogleHomeTypes[mapType]
        break
      }
    }
  }

  /**
   * Decorate capabilities for Google Home
   */
  decorateCapabilitiesForGoogleHome () {
    this.decorated = this.decorated || {}
    if (this.attributes.capabilties === undefined) {
      this.attributes.capabilties = this.getDefaultCapabilities(this.attributes.type)
    }
    const capabilities = this.attributes.capabilties.split(',')
      .map(cap => cap.toString().trim())
      .filter(cap => cap !== '')
    this.decorated.traits = []
    for (const capability of capabilities) {
      for (const mapType in mappingGoogleHomeCapabilities) {
        if (mapType === capability) {
          if (Array.isArray(mappingGoogleHomeCapabilities[mapType]) === true) {
            this.decorated.traits = this.decorated.traits.concat(mappingGoogleHomeCapabilities[mapType])
          } else {
            this.decorated.traits.push(mappingGoogleHomeCapabilities[mapType])
          }
          break
        }
      }
    }
  }

  /**
   * Decorate device for Alexa
   *
   * @returns {Object}
   */
  decorateForAlexa () {
    this.decorated = {
      endpointId: this.name,
      manufacturerName: MANUFACTURER,
      friendlyName: this.attributes.nickname ? this.attributes.nickname : this.name,
      description: this.attributes.description,
      displayCategories: [],
      cookie: {},
      capabilities: []
    }
    this.decorateTypeForAlexa()
    this.decorateCapabilitiesForAlexa()
    return this.decorated
  }

  /**
   * Decorate type for Alexa
   */
  decorateTypeForAlexa () {
    this.decorated = this.decorated || {}
    if (this.attributes.type === undefined) {
      this.attributes.type = DEFAULT_TYPE
    }
    for (const mapType in mappingAlexaTypes) {
      if (mapType === this.attributes.type) {
        if (Array.isArray(mappingAlexaTypes[mapType]) === true) {
          this.decorated.displayCategories = this.decorated.displayCategories.concat(mappingAlexaTypes[mapType])
        } else {
          this.decorated.displayCategories.push(mappingAlexaTypes[mapType])
        }
        break
      }
    }
  }

  /**
   * Decorate capabilities for Alexa
   */
  decorateCapabilitiesForAlexa () {
    this.decorated = this.decorated || {}
    if (this.attributes.capabilties === undefined) {
      this.attributes.capabilties = this.getDefaultCapabilities(this.attributes.type)
    }
    const capabilities = this.attributes.capabilties.split(',')
      .map(cap => cap.toString().trim())
      .filter(cap => cap !== '')
    this.decorated.capabilities = [{
      type: 'AlexaInterface',
      interface: 'Alexa',
      version: '3'
    }]
    for (const capability of capabilities) {
      for (const mapType in mappingAlexaCapabilities) {
        if (mapType === capability) {
          if (Array.isArray(mappingAlexaCapabilities[mapType]) === true) {
            this.decorated.capabilities = this.decorated.capabilities.concat(mappingAlexaCapabilities[mapType])
          } else {
            this.decorated.capabilities.push(mappingAlexaCapabilities[mapType])
          }
          break
        }
      }
    }
  }

  /**
   * Default capabilities attribute
   */
  getDefaultCapabilities (type) {
    switch (type) {
      case 'Light':
        return 'OnOff'
      case 'Switch':
        return 'OnOff'
    }
    return ''
  }
}
