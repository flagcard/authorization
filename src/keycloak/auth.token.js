const jwt = require('jwt-simple');
const forbidden = require('./forbidden');
const config = require('../config');

module.exports = () => (req, res, next) => {
  const token = req.headers['auth-token'];
  if (token) {
    try {
      const decoded = jwt.decode(token, config.secret());
      if (!decoded.user_id) {
        forbidden(res, 'You need to send an user_id to this request');
      } else {
        req.payload = decoded;
        next();
      }
    } catch (e) {
      forbidden(res, 'Signature verification failed');
    }
  } else {
    forbidden(res, 'Auth token not prensent in header');
  }
};
