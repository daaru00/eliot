const { ssm } = require('middy/middlewares')
const SSM_PREFIX = 'ssm:'

/**
 * SSM parameter store auto-load
 */
const DEFAULT_CONFIG = {
  cache: true,
  cacheExpiryInMillis: 10 * 60 * 1000, // 10 mins
  names: {},
  awsSdkOptions: {
    logger: process.env.DEBUG === 'yes' ? console : undefined
  }
}

/**
 * Load SSM parameters
 */
module.exports = (opts) => {
  const options = Object.assign({}, DEFAULT_CONFIG, opts)

  // Iterate through environments variables
  for (const key in process.env) {
    if (process.env[key] !== undefined) {
      const value = process.env[key]
      // Check if environment variable starts with prefix ssm: (ex: ssm:/test/)
      if (value.toString().startsWith(SSM_PREFIX) === false) {
        continue
      }
      // Set variable and remove prefix
      options.names[key] = value.replace(SSM_PREFIX, '')
    }
  }

  return ssm(options)
}
