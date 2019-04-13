/* global describe, it, before */
const assert = require('chai').assert
const url = require('url')

const auth = require('../../auth/auth')

describe('Auth', function () {
  describe('Retrive auth code', async function () {
    let response = {}

    before(function (done) {
      auth.handler({
        queryStringParameters: {
          client_id: process.env.CLIENT_ID,
          redirect_uri: `https://oauth-redirect.googleusercontent.com/r/${process.env.GOOGLE_PROJECT_ID || 'test-1234'}`,
          response_type: 'code',
          state: 'test'
        },
        body: {}
      }, null, (error, result) => {
        if (error) {
          console.error(error)
          done(error)
          return
        }
        response = result
        done()
      })
    })

    it('should response with a temporary redirect', function () {
      assert.strictEqual(response.statusCode, 302)
    })
    it('should contain header location', function () {
      assert.isDefined(response.headers)
      assert.isDefined(response.headers.Location)
    })
    it('should redirect URL has the same state provided', function () {
      const location = new url.URL(response.headers.Location)
      const queryParameters = new url.URLSearchParams(location.search)
      assert.strictEqual(queryParameters.get('state'), 'test')
    })
    it('should redirect URL contain a valid the auth code', function () {
      const location = new url.URL(response.headers.Location)
      const queryParameters = new url.URLSearchParams(location.search)
      assert.isDefined(queryParameters.get('code'))
      assert.isString(queryParameters.get('code'), 'test')
      assert.isAtLeast(queryParameters.get('code').length, 5)
    })
  })
})
