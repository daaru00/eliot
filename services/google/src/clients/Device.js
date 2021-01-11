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
      const { data } = await this.client.get(`/google/device/${deviceId}`)
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
    const { data } = await this.client.get(`/google/device`)
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
    try {
      const { data } = await this.client.post(`/google/device/${deviceId}/command/execute`, {
        command,
        payload
      })
      return data
    } catch (error) {
      switch (error.response.status) {
      case 404:
        throw new Error('deviceNotFound')
      case 501:
        throw new Error('actionNotAvailable')
      default:
        throw new Error('hardError')
      }
    }
  }

}

module.exports = Device
