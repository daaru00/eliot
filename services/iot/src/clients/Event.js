const EventBridge = require('aws-sdk/clients/eventbridge')
const eventBridge = new EventBridge({ 
  apiVersion: '2015-10-07',
  logger: console
})

class Event {

  /**
   * Constructor
   */
  constructor() {
    this.eventBus = process.env.EVENT_BUS || 'default'
    this.source = 'eliot.iot'
  }

  /**
   * Emit event
   * 
   * @param {string} type 
   * @param {object} detail 
   */
  async emit(type, detail) {
    await eventBridge.putEvents({
      Entries: [{
        EventBusName: this.eventBus,
        Source: this.source,
        DetailType: type,
        Detail: JSON.stringify(detail)
      }]
    }).promise()
  }

  /**
   * Emit DeviceCreatedOrUpdated event
   * 
   * @param {object} details
   * @param {string} details.device
   * @param {string} details.operation
   */
  async emitDeviceCreatedOrUpdated(details) {
    await this.emit('Device Definition Changed', details)
  }

  /**
   * Emit DeviceDeleted event
   * 
   * @param {object} details
   * @param {string} details.device
   */
  async emitDeviceDeleted(details) {
    await this.emit('Device Deleted', details)
  }

  /**
   * Emit DeviceStateChanged event
   * 
   * @param {object} details
   * @param {string} details.provider
   * @param {string} details.device
   * @param {object} details.state
   */
  async emitDeviceStateChanged(details) {
    await this.emit('Device State Changed', details)
  }

  /**
   * Emit DeviceCommandExecuted event
   * 
   * @param {object} details
   * @param {string} details.provider
   * @param {string} details.device
   * @param {string} details.command
   * @param {object} details.payload
   */
  async emitDeviceCommandExecuted(details) {
    await this.emit('Device Command Executed', details)
  }

  /**
   * Emit DeviceNotFoundError event
   * 
   * @param {object} details
   * @param {string} details.provider
   * @param {string} details.device
   */
  async emitDeviceNotFoundError(details) {
    await this.emit('Device Not Found Error', details)
  }

  /**
   * Emit DeviceCommandNotImplemented event
   * 
   * @param {object} details
   * @param {string} details.provider
   * @param {string} details.device
   * @param {string} details.command
   * @param {object} details.payload
   */
  async emitDeviceCommandNotImplementedError(details) {
    await this.emit('Device Command Not Implemented', details)
  }

}

module.exports = new Event()
