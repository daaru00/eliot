const AlexaTokens = require('../clients/AlexaTokens')
const alexaTokens = new AlexaTokens()

/**
 * Directive handler
 *
 * @param {Object} directive
 */
module.exports = async (directive) => {
  const header = directive.header
  header.name = 'AcceptGrant.Response'

  if (
    directive.payload.grant &&
    directive.payload.grant.type === 'OAuth2.AuthorizationCode'
  ) {

    await alexaTokens.retrieveTokens(directive.payload.grant.code)
  }

  return {
    event: {
      header: header,
      payload: {}
    }
  }
}
