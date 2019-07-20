const Keycloak = require('keycloak-connect');
const config = require('./keycloak');
const environment = require('./environment');

const keycloak = new Keycloak({}, config);

module.exports = (value) => {
  if (environment.isProduction(value)) {
    return keycloak.middleware();
  }
  return (req, res, next) => next();
};
