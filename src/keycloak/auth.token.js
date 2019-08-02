const Token = require('../builder/token');
const forbidden = require('./forbidden');
const config = require('../config');

module.exports = () => (req, res, next) => {
  if (config.isProduction()) {
    const authorization = req.headers.authorization || req.headers.Authorization;
    if (authorization) {
      try {
        const token = Token.decode(authorization, config.secret());
        token.validate();
        req.token = token;
        next();
      } catch (e) {
        forbidden(res, e.message);
      }
    } else {
      forbidden(res, 'Authorization token is not prensent in header');
    }
  } else {
    req.token = {
      sub: 'e9fd456a-599c-4942-b249-fc457bb4b278',
      iss: 'non-productive-issuer',
      aud: 'non-productive-dest',
    };
  }
};
