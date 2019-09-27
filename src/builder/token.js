const moment = require('moment');
const jwt = require('jsonwebtoken');

class Token {
  constructor(token) {
    this.sub = token.sub;
    this.iss = token.iss;
    this.aud = token.aud;
    this.iat = token.iat;
    this.exp = token.exp;
    this.validate();
  }

  static decode(token, secret) {
    let encoded = token;
    if (token.startsWith('Bearer')) {
      encoded = token.substring(7);
    }
    const decoded = jwt.verify(encoded, secret, { algorithms: ['HS512'] });
    return new Token(decoded);
  }

  validate() {
    if (!this.sub || !this.exp) {
      throw new Error('It is highly recommended to inform these fields: sub and exp');
    }
  }
}

module.exports = Token;
