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
    this.source = 'eliot.google'
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
   * Emit GoogleCommandRequested event
   */
  async emitGoogleCommandRequested() {
    await this.emit('Google Command Requested')
  }

  /**
   * Emit GoogleReSyncAsked event
   */
  async emitGoogleReSyncAsked() {
    await this.emit('Google ReSync Asked')
  }

  /**
   * Emit GoogleStateReported event
   */
  async emitGoogleStateReported() {
    await this.emit('Google State Reported')
  }

}

module.exports = new Event()
