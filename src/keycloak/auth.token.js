const jwt = require('jwt-simple');
const forbidden = require('./forbidden');

const SECRET = 'Th3B1fR0sT1sCL0S3dbYY0UrF4th3RS0rD3rS';

module.exports = () => (req, res, next) => {
  const token = req.headers['auth-token'];
  if (token) {
    try {
      const decoded = jwt.decode(token, SECRET);
      if (!decoded.user_id) {
        forbidden(res);
      } else {
        req.payload = decoded;
        next();
      }
    } catch (e) {
      forbidden(res);
    }
  } else {
    forbidden(res);
  }
};
