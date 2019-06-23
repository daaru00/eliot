/* global describe, it, before */
const assert = require('chai').assert

const IoT = require('../../../mock/iot')
const Switch = require('../../../../iot/devices/google/Switch')

describe('Switch - Google Home', () => {
  /**
   * Sync
   */
  describe('sync response', async () => {
    let device = null

    before(function (done) {
      device = new Switch({
        thingName: 'Test',
        thingArn: 'arn:::',
        attributes: {
          nickname: 'Test Nick',
          room: 'Test Room'
        }
      })
      done()
    })

    it('should return valid name', () => {
      const data = device.getDescription()
      assert.strictEqual(data.id, 'Test')
      assert.isObject(data.name)
      assert.strictEqual(data.name.name, 'Test')
      assert.isArray(data.name.nicknames)
      assert.isNotEmpty(data.name.nicknames)
      assert.deepStrictEqual(data.name.nicknames, [
        'Test Nick'
      ])
    })

    it('should return valid type', () => {
      const data = device.getDescription()
      assert.strictEqual(data.type, 'action.devices.types.SWITCH')
    })

    it('should return valid traits', () => {
      const data = device.getDescription()
      assert.isArray(data.traits)
      assert.isNotEmpty(data.traits)
      assert.deepStrictEqual(data.traits, [
        'action.devices.traits.OnOff'
      ])
    })

    it('should return valid room', () => {
      const data = device.getDescription()
      assert.strictEqual(data.roomHint, 'Test Room')
    })

    it('should return valid device info', () => {
      const data = device.getDescription()
      assert.isObject(data.deviceInfo)
      assert.isNotEmpty(data.deviceInfo)
      assert.deepStrictEqual(data.deviceInfo, {
        manufacturer: 'Eliot',
        model: 'virtual',
        hwVersion: '1.0',
        swVersion: '1.0'
      })
    })
  })

  /**
   * State
   */
  describe('state response', async () => {
    let device = null

    before(function (done) {
      device = new Switch({
        thingName: 'Test',
        thingArn: 'arn:::',
        attributes: {}
      })
      done()
    })

    it('should return valid state online', async () => {
      device.setShadow({})
      const data = await device.getState()
      assert.isBoolean(data.online)
      assert.strictEqual(data.online, true)
    })

    it('should return valid state when on', async () => {
      device.setShadow({
        on: true
      })
      const data = await device.getState()
      assert.isBoolean(data.on)
      assert.strictEqual(data.on, true)
    })

    it('should return valid state when off', async () => {
      device.setShadow({
        on: false
      })
      const data = await device.getState()
      assert.isBoolean(data.on)
      assert.strictEqual(data.on, false)
    })
  })

  /**
   * Commands
   */
  describe('commands response', async () => {
    let device = null

    before(function (done) {
      device = new Switch({
        thingName: 'Test',
        thingArn: 'arn:::',
        attributes: {}
      })
      device.dataClient = new IoT()
      done()
    })

    it('should switch on', async () => {
      device.setShadow({
        on: false
      })
      await device.execute('action.devices.commands.OnOff', {
        on: true
      })
      const data = await device.getState()
      assert.isBoolean(data.on)
      assert.strictEqual(data.on, true)
    })

    it('should switch off', async () => {
      device.setShadow({
        on: true
      })
      await device.execute('action.devices.commands.OnOff', {
        on: false
      })
      const data = await device.getState()
      assert.isBoolean(data.on)
      assert.strictEqual(data.on, false)
    })
  })
})
