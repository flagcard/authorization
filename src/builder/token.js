const moment = require('moment');
const jwt = require('jwt-simple');

class Token {
  constructor(token) {
    this.sub = token.sub;
    this.iss = token.iss;
    this.aud = token.aud;
    this.iat = token.iat;
    this.exp = token.exp;
    this.payload = token.payload;
  }

  encode(secret) {
    const o = {};
    o.sub = this.sub;
    o.iss = this.iss;
    o.aud = this.aud;
    o.iat = this.iat;
    o.exp = this.exp;
    o.payload = this.payload;
    return `Bearer ${jwt.encode(o, secret)}`;
  }

  static decode(token, secret) {
    const encoded = token.substring(7);
    const decoded = jwt.decode(encoded, secret);
    return new Token(decoded);
  }

  validate() {
    if (!this.sub || !this.exp) {
      throw new Error('It is highly recommended to inform these fields: sub and exp');
    }
    const currenttime = moment.utc().toDate().getTime();
    if (currenttime >= this.exp) {
      throw new Error('Impossible to proceed with expired token');
    }
  }

  static builder() {
    class Builder {
      sub(sub) {
        this.sub = sub;
        return this;
      }

      iss(iss) {
        this.iss = iss;
        return this;
      }

      aud(aud) {
        this.aud = aud;
        return this;
      }

      payload(payload) {
        this.payload = payload;
        return this;
      }

      build() {
        this.iat = moment.utc().toDate().getTime();
        this.exp = moment.utc().add(3, 'minutes').toDate().getTime();
        return new Token(this);
      }
    }
    return new Builder();
  }
}

module.exports = Token;
