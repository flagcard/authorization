const http_status = require('http-status');

module.exports = (res, error) => {
  if (!error) throw new Error();
  res.setHeader('Content-Length', '0');
  res.status(http_status.FORBIDDEN).json({ error });
  res.end();
};
