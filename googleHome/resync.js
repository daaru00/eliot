const middy = require('middy')
const got = require('got')
const loggerMiddleware = require('../common/middlewares/eventLogger')

const ENDPOINT = 'https://homegraph.googleapis.com/v1/devices:requestSync'

/**
 * Lambda handler
 */
const askResync = async () => {
  if (process.env.GOOGLE_APY_KEY === undefined || process.env.GOOGLE_APY_KEY === null) {
    return
  }
  const response = await got.post(`${ENDPOINT}?key=${process.env.GOOGLE_APY_KEY}`, {
    body: {
      agentUserId: process.env.ACCOUNT_ID || 'eliot-user',
      async: false
    }
  })
  console.log('response', JSON.stringify(response.body))
  return response.body
}

const handler = middy(askResync)
  .use(loggerMiddleware)

module.exports = { handler }
