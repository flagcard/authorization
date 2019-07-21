const Token = require('../builder/token');
const forbidden = require('./forbidden');
const config = require('../config');

module.exports = () => (req, res, next) => {
  const authorization = req.headers.authorization || req.headers.Authorization;
  if (authorization) {
    try {
      const token = Token.decode(authorization, config.secret());
      token.validate();
      req.payload = {
        user_id: token.sub,
        ...token.payload,
      };
      next();
    } catch (e) {
      forbidden(res, e.message);
    }
  } else {
    forbidden(res, 'Authorization token is not prensent in header');
  }
};
