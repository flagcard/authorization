const { expect } = require('chai');
const moment = require('moment');
const Token = require('../../src/builder/token');

describe('Token Builder', () => {
  it('should create correct token', () => {
    const token = Token.builder()
      .sub('b36d21fe-123f-4258-86d4-ed063b74414c')
      .iss('bifrost')
      .aud('odin')
      .payload({ store_id: 'b36d21fe-123f-4258-86d4-ed063b74414c' })
      .build();
    expect(token).to.have.property('sub', 'b36d21fe-123f-4258-86d4-ed063b74414c');
    expect(token).to.have.property('iss', 'bifrost');
    expect(token).to.have.property('aud', 'odin');
    expect(token.iat).to.be.an('number');
    expect(token.exp).to.be.an('number');
    expect(token.payload).to.have.property('store_id', 'b36d21fe-123f-4258-86d4-ed063b74414c');
  });
  it('should encode a token', () => {
    const token = Token.builder()
      .sub('b36d21fe-123f-4258-86d4-ed063b74414c')
      .iss('bifrost')
      .aud('odin')
      .payload({ store_id: 'b36d21fe-123f-4258-86d4-ed063b74414c' })
      .build();
    const encoded = token.encode('secret');
    expect(encoded).to.be.an('string');
  });
  it('should decode a token', () => {
    const encoded = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMzZkMjFmZS0xMjNmLTQyNTgtODZkNC1lZDA2M2I3NDQxNGMiLCJpc3MiOiJiaWZyb3N0IiwiYXVkIjoib2RpbiIsImlhdCI6MTU2Mzc0MTIwNzQ5OSwiZXhwIjoxNTYzNzQxMzg3NDk5LCJwYXlsb2FkIjp7InN0b3JlX2lkIjoiYjM2ZDIxZmUtMTIzZi00MjU4LTg2ZDQtZWQwNjNiNzQ0MTRjIn19.iSdv_rgkzH5zd3qATjkxnYvRWS45YhzSMOrnireENyI';
    const token = Token.decode(encoded, 'secret');
    expect(token).to.have.property('sub', 'b36d21fe-123f-4258-86d4-ed063b74414c');
    expect(token).to.have.property('iss', 'bifrost');
    expect(token).to.have.property('aud', 'odin');
    expect(token.iat).to.be.an('number');
    expect(token.exp).to.be.an('number');
    expect(token.payload).to.have.property('store_id', 'b36d21fe-123f-4258-86d4-ed063b74414c');
  });
  it('should throw an Error when token has expired', () => {
    const o = {};
    o.sub = 'b36d21fe-123f-4258-86d4-ed063b74414c';
    o.exp = moment.utc().subtract(5, 'minutes').toDate().getTime();
    const token = new Token(o);
    expect(() => token.validate()).to.throw('Impossible to proceed with expired token');
  });
  it('should throw an Error when sub is not present', () => {
    const token = new Token({});
    expect(() => token.validate()).to.throw('It is highly recommended to inform these fields: sub and exp');
  });
  it('should throw an Error when decode with invalid secret', () => {
    const encoded = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMzZkMjFmZS0xMjNmLTQyNTgtODZkNC1lZDA2M2I3NDQxNGMiLCJpc3MiOiJiaWZyb3N0IiwiYXVkIjoib2RpbiIsImlhdCI6MTU2Mzc0MTIwNzQ5OSwiZXhwIjoxNTYzNzQxMzg3NDk5LCJwYXlsb2FkIjp7InN0b3JlX2lkIjoiYjM2ZDIxZmUtMTIzZi00MjU4LTg2ZDQtZWQwNjNiNzQ0MTRjIn19.iSdv_rgkzH5zd3qATjkxnYvRWS45YhzSMOrnireENyI';
    expect(() => Token.decode(encoded, 'incorrect secret')).to.throw('Signature verification failed');
  });
});
