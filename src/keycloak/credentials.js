const jwt = require('jwt-decode');
const environment = require('./environment');
const forbidden = require('./forbidden');

module.exports = () => (req, res, next) => {
  if (environment.isProduction()) {
    const authorization = req.headers.authorization || req.headers.Authorization;
    if (authorization) {
      const token = authorization.substring(7);
      const decoded = jwt(token);
      req.user_id = decoded.sub;
      next();
    } else {
      forbidden(res);
    }
  } else {
    req.user_id = 'e9fd456a-599c-4942-b249-fc457bb4b278';
    next();
  }
};
