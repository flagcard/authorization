const http_status = require('http-status');
const log = require('@flagcard/log');

module.exports = (res, error) => {
  if (!error) throw new Error();
  log.error(`Authorization: Forbidden. ${error}`);
  res.setHeader('Content-Length', '0');
  res.status(http_status.FORBIDDEN).json({ error });
  res.end();
};
