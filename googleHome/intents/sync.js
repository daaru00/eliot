
/**
 * Intent handler
 *
 * @param {Object} intent
 * @returns {Object}
 */
module.exports = async (intent) => {
  return {
    agentUserId: '1836.15267389',
    devices: [{
      id: '456',
      type: 'action.devices.types.LIGHT',
      traits: [
        'action.devices.traits.OnOff',
        'action.devices.traits.Brightness',
        'action.devices.traits.ColorTemperature',
        'action.devices.traits.ColorSpectrum'
      ],
      name: {
        defaultNames: ['lights out inc. bulb A19 color hyperglow'],
        name: 'lamp1',
        nicknames: ['reading lamp']
      },
      willReportState: false,
      roomHint: 'office',
      attributes: {
        temperatureMinK: 2000,
        temperatureMaxK: 6500
      },
      deviceInfo: {
        manufacturer: 'lights out inc.',
        model: 'hg11',
        hwVersion: '1.2',
        swVersion: '5.4'
      },
      customData: {
        fooValue: 12,
        barValue: false,
        bazValue: 'bar'
      }
    }]
  }
}
