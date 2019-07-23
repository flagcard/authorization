const Token = require('./src/builder/token');
const authorization = require('./src/keycloak/authorization');
const credentials = require('./src/keycloak/credentials');
const authToken = require('./src/keycloak/auth.token');
const { secret } = require('./src/config');

module.exports = {
  authorization,
  credentials,
  authToken,
  secret,
  Token,
};
