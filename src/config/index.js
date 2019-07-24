const environment = process.env.NODE_ENV || 'development';
const keycloak = require('./keycloak');

const isProduction = () => environment === 'production';

const secret = () => {
  if (isProduction()) {
    if (!process.env.AUTH_SECRET) {
      throw new Error('You must define an environment variable for secrets');
    }
    return process.env.AUTH_SECRET;
  }
  return process.env.AUTH_SECRET || environment;
};

module.exports = {
  isProduction,
  keycloak,
  secret,
};
