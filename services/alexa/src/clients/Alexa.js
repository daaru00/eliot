const axios = require("axios")

const EVENT_ENDPOINT_US = 'https://api.amazonalexa.com/v3/events'
const EVENT_ENDPOINT_EU = 'https://api.eu.amazonalexa.com/v3/events'
const EVENT_ENDPOINT_FE = 'https://api.fe.amazonalexa.com/v3/events'

class Alexa {

  /**
   * Constructor
   * 
   * @param {string} endpoint
   */
  constructor(endpoint) {
    switch (endpoint) {
    case 'NorthAmerica':
      this.endpoint = EVENT_ENDPOINT_US
      break
    case 'Europe':
      this.endpoint = EVENT_ENDPOINT_EU
      break
    case 'FarEast':
      this.endpoint = EVENT_ENDPOINT_FE
      break
    default:
      this.endpoint = EVENT_ENDPOINT_US
      break
    }
  }

  /**
   * Execute request
   * 
   * @param {object} request
   * @returns {object}
   */
  async executeRequest(request) {
    let data = null
    try {
      const response = await axios.post(this.endpoint, request)
      console.log('report state response', JSON.stringify(data))
      data = response.data
    } catch (err) {
      console.error(err.response.data)
      throw err
    }
    return data
  }

}

module.exports = Alexa
