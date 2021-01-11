const axios = require("axios")
const { aws4Interceptor } = require("aws4-axios")
const axiosLogger = require("axios-logger")

/**
 * @property {axios} client
 */
class Device {
  /**
   * Constructor
   * 
   * @param {string} endpoint
   * @param {string} region
   */
  constructor (endpoint, region) {
    endpoint = endpoint || process.env.IOT_ENDPOINT_URL
    region = region || process.env.AWS_REGION

    this.client = axios.default.create({
      baseURL: endpoint
    })

    // AWS authentication
    this.client.interceptors.request.use(aws4Interceptor({
      region,
      service: 'execute-api'
    }));

    // Logger
    this.client.interceptors.request.use(axiosLogger.requestLogger, axiosLogger.errorLogger);
    this.client.interceptors.response.use(axiosLogger.responseLogger, axiosLogger.errorLogger);
  }

  /**
   * Get device by id
   * 
   * @param {string} deviceId 
   */
  async getDevice (deviceId) {
    try {
      const { data } = await this.client.get(`/alexa/device/${deviceId}`)
      return data
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * List devices
   * 
   * @returns {object}
   */
  async listDevices () {
    const { data } = await this.client.get(`/alexa/device`)
    return data.devices || []
  }

  /**
   * Execute command
   * 
   * @param {string} deviceId
   * @param {string} command
   * @param {object} payload
   * @returns {object}
   */
  async executeCommand (deviceId, command, payload = {}) {
    const { data } = await this.client.post(`/alexa/device/${deviceId}/command/execute`, {
      command,
      payload
    })
    return data
  }

}

module.exports = Device
