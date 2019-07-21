const http_status = require('http-status');

module.exports = (res) => {
  res.statusCode = http_status.FORBIDDEN;
  res.setHeader('Content-Length', '0');
  res.end();
};
