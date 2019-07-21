const Keycloak = require('keycloak-connect');
const config = require('../config');

const keycloak = new Keycloak({}, config.keycloak);

module.exports = (value) => {
  if (config.isProduction(value)) {
    return keycloak.middleware();
  }
  return (req, res, next) => next();
};
