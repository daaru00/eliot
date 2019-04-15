/* global describe, it, before */
const assert = require('chai').assert
const url = require('url')

const auth = require('../../../auth/auth')
const token = require('../../../auth/token')
const authorizer = require('../../../auth/authorizer')

let authCode = ''
let accessToken = ''
let refreshToken = ''

describe('Auth', function () {
  /**
   * Auth code
   */
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
      authCode = queryParameters.get('code')
      assert.isDefined(authCode)
      assert.isString(authCode, 'test')
      assert.isAtLeast(authCode.length, 5)
    })
  })

  /**
   * Auth code to tokens
   */
  describe('Exchange auth code with tokens', async function () {
    let response = {}

    before(function (done) {
      token.handler({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        queryStringParameters: {},
        body: `client_id=${process.env.CLIENT_ID}&` +
              `client_secret=${process.env.CLIENT_SECRET}&` +
              `grant_type=authorization_code&` +
              `code=${authCode}`
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

    it('should response with a success status', function () {
      assert.strictEqual(response.statusCode, 200)
    })
    it('should response is in json format', function () {
      try {
        assert.isObject(JSON.parse(response.body))
      } catch (e) {
        assert.fail('body is not a valid JSON string')
      }
    })
    it('should response contains valid token type', function () {
      const body = JSON.parse(response.body)
      assert.strictEqual(body.token_type, 'Bearer')
    })
    it('should response contains non expired tokens', function () {
      const body = JSON.parse(response.body)
      assert.isNumber(body.expires_in)
      assert.isAtLeast(body.expires_in, 2592000)
    })
    it('should response contain valid tokens', function () {
      const body = JSON.parse(response.body)
      accessToken = body.access_token
      assert.isDefined(accessToken)
      assert.isAtLeast(accessToken.length, 40)
      refreshToken = body.refresh_token
      assert.isDefined(refreshToken)
      assert.isAtLeast(refreshToken.length, 40)
    })
  })

  /**
   * Validate access token
   */
  describe('Access resources with access token', async function () {
    let response = {}

    before(function (done) {
      authorizer.handler({
        authorizationToken: accessToken
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

    it('should response with a user principalId', function () {
      assert.strictEqual(response.principalId, 'user')
    })
    it('should contains a policyDocument', function () {
      assert.isDefined(response.policyDocument)
    })
    it('should policyDocument allow to invoke API', function () {
      const document = response.policyDocument
      assert.isArray(document.Statement)
      assert.isAtLeast(document.Statement.length, 1)
      const statement = document.Statement[0]
      assert.strictEqual(statement.Action, 'execute-api:Invoke')
      assert.strictEqual(statement.Effect, 'Allow')
    })
  })

  /**
   * Refresh token to access token
   */
  describe('Exchange refresh token with access token', async function () {
    let response = {}

    before(function (done) {
      token.handler({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        queryStringParameters: {},
        body: `client_id=${process.env.CLIENT_ID}&` +
              `client_secret=${process.env.CLIENT_SECRET}&` +
              `grant_type=refresh_token&` +
              `refresh_token=${refreshToken}`
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

    it('should response with a success status', function () {
      assert.strictEqual(response.statusCode, 200)
    })
    it('should response is in json format', function () {
      try {
        assert.isObject(JSON.parse(response.body))
      } catch (e) {
        assert.fail('body is not a valid JSON string')
      }
    })
    it('should response contains valid token type', function () {
      const body = JSON.parse(response.body)
      assert.strictEqual(body.token_type, 'Bearer')
    })
    it('should response contains non expired tokens', function () {
      const body = JSON.parse(response.body)
      assert.isNumber(body.expires_in)
      assert.isAtLeast(body.expires_in, 2592000)
    })
    it('should response contain valid access token', function () {
      const body = JSON.parse(response.body)
      const oldAccessToken = accessToken
      accessToken = body.access_token
      assert.isDefined(accessToken)
      assert.isAtLeast(accessToken.length, 40)
      assert.notStrictEqual(accessToken, oldAccessToken)
    })
  })

  /**
   * Validate new access token
   */
  describe('Access resources with the new access token', async function () {
    let response = {}

    before(function (done) {
      authorizer.handler({
        authorizationToken: accessToken
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

    it('should response with a user principalId', function () {
      assert.strictEqual(response.principalId, 'user')
    })
    it('should contains a policyDocument', function () {
      assert.isDefined(response.policyDocument)
    })
    it('should policyDocument allow to invoke API', function () {
      const document = response.policyDocument
      assert.isArray(document.Statement)
      assert.isAtLeast(document.Statement.length, 1)
      const statement = document.Statement[0]
      assert.strictEqual(statement.Action, 'execute-api:Invoke')
      assert.strictEqual(statement.Effect, 'Allow')
    })
  })

  /**
   * Use the Auth code a second time
   */
  describe('Try using the auth code a second tim', async function () {
    let response = {}

    before(function (done) {
      token.handler({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        queryStringParameters: {},
        body: `client_id=${process.env.CLIENT_ID}&` +
              `client_secret=${process.env.CLIENT_SECRET}&` +
              `grant_type=authorization_code&` +
              `code=${authCode}`
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

    it('should response with an error', function () {
      assert.strictEqual(response.statusCode, 400)
    })
  })
})
