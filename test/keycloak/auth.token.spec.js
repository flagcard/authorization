const moment = require('moment');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const { Token, authToken } = require('../..');
const config = require('../../src/config');

describe('Auth Token', () => {
  const SECRET = 'Th3B1fR0sT1sCL0S3dbYY0UrF4th3RS0rD3rS';
  const options = { algorithm: 'HS512' };
  const req = {};
  const res = {};
  let json;
  let next;
  beforeEach(() => {
    sinon.createSandbox().stub(config, 'secret').returns(SECRET);
    req.headers = {};
    json = sinon.fake();
    res.status = sinon.fake.returns(({ json }));
    res.setHeader = sinon.fake();
    res.end = sinon.fake();
    next = sinon.fake();
  });
  afterEach(() => {
    config.secret.restore();
  });
  it('should return 403 if no auth-token provider', () => {
    sinon.createSandbox().stub(config, 'isProduction').returns(true);

    authToken(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'Authorization token is not prensent in header');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
    config.isProduction.restore();
  });
  it('should return 403 if decoded token has no user_id', () => {
    sinon.createSandbox().stub(config, 'isProduction').returns(true);
    const token = jwt.sign({}, SECRET, options);
    req.headers.authorization = `Bearer ${token}`;

    authToken(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'It is highly recommended to inform these fields: sub and exp');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
    config.isProduction.restore();
  });
  it('should return 403 if a token token was decoded with another secret', () => {
    sinon.createSandbox().stub(config, 'isProduction').returns(true);
    const token = jwt.sign({ sub: 'b36d21fe-123f-4258-86d4-ed063b74414c' }, 'another-secret', options);
    req.headers.Authorization = `Bearer ${token}`;

    authToken(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'invalid signature');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
    config.isProduction.restore();
  });
  it('should return 403 if a token token was expired', () => {
    sinon.createSandbox().stub(config, 'isProduction').returns(true);
    const token = jwt.sign({
      sub: '25e1a524-01eb-4c42-b3b2-86280c5e61ca',
      exp: Math.floor(Date.now() / 1000) - 5,
    }, SECRET, options);
    req.headers.Authorization = `Bearer ${token}`;

    authToken(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'jwt expired');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
    config.isProduction.restore();
  });
  it('req should have payload property', () => {
    sinon.createSandbox().stub(config, 'isProduction').returns(true);
    const token = jwt.sign({
      sub: '25e1a524-01eb-4c42-b3b2-86280c5e61ca',
      exp: Math.floor(Date.now() / 1000) + 5,
    }, SECRET, options);
    req.headers.Authorization = `Bearer ${token}`;

    authToken(req, res, next);

    expect(req).to.have.property('token');
    expect(req.token).to.have.property('sub', '25e1a524-01eb-4c42-b3b2-86280c5e61ca');
    config.isProduction.restore();
  });
  it.skip('should decode properly a mjoinr token', () => {
    const token = Token.decode('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJiaWZyb3N0IiwiaXNzIjoiZGV2aWNlIiwic3ViIjoiY2Q3Y2JiMmMtMGMyMS00NDQxLTk4ZWEtNWJiMzlkMDBkODBmIiwiaWF0IjoxNTY5NDYxNTU5LCJleHAiOjE1Njk0NjE2NDl9.boLPYnGEduBbZH-9dfka0F-ArONZJzdlWSG2FKJYNPtMRqQ67VPH2VGeF0CmiNof5N8ZOCK-xjHPX5Za-yTHMg', SECRET);
    console.log(token);
  });
});
