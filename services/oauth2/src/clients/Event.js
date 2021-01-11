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
    this.source = 'eliot.oauth2'
  }

  /**
   * Emit event
   * 
   * @param {string} type 
   * @param {object} detail 
   */
  async emit(type, detail = {}) {
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
   * Emit AuthCodeRequested event
   */
  async emitAuthCodeRequested() {
    await this.emit('AuthCode Requested')
  }

  /**
   * Emit AuthCodeExchanged event
   */
  async emitAuthCodeExchanged() {
    await this.emit('AuthCode Exchanged')
  }

  /**
   * Emit AccessTokenGenerated event
   */
  async emitAccessTokenGenerated() {
    await this.emit('AccessToken Generated')
  }

  /**
   * Emit AuthCodeError event
   * 
   * @param {Error} err
   */
  async emitAuthCodeError(err) {
    await this.emit('AuthCode Error', err)
  }

  /**
   * Emit AuthCodeExchangeError event
   * 
   * @param {Error} err
   */
  async emitAuthCodeExchangeError(err) {
    await this.emit('AuthCode Exchange Error', err)
  }

  /**
   * Emit AccessTokenGenerateError event
   * 
   * @param {Error} err
   */
  async emitAccessTokenGenerateError(err) {
    await this.emit('AccessToken Generate Error', err)
  }

}

module.exports = new Event()
