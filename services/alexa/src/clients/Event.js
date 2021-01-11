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
    this.source = 'eliot.alexa'
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
   * Emit AlexaCommandRequested event
   */
  async emitAlexaCommandRequested() {
    await this.emit('Alexa Command Requested')
  }

  /**
   * Emit AlexaReSyncAsked event
   */
  async emitAlexaReSyncAsked() {
    await this.emit('Alexa ReSync Asked')
  }

  /**
   * Emit AlexaStateReported event
   */
  async emitAlexaStateReported() {
    await this.emit('Alexa State Reported')
  }
}

module.exports = new Event()
