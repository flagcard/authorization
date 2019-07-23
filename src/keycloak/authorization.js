const Keycloak = require('keycloak-connect');
const config = require('../config');

const keycloak = new Keycloak({}, config.keycloak);

module.exports = () => {
  if (config.isProduction()) {
    return keycloak.middleware();
  }
  return (req, res, next) => next();
};
