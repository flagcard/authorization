const sinon = require('sinon');
const { expect } = require('chai');
const { Token, authToken } = require('../index');
const config = require('../src/config');

describe('Auth Token', () => {
  const req = {};
  const res = {};
  let json;
  let next;
  beforeEach(() => {
    sinon.createSandbox().stub(config, 'secret').returns('Th3B1fR0sT1sCL0S3dbYY0UrF4th3RS0rD3rS');
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
    authToken()(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'Authorization token is not prensent in header');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('should return 403 if decoded token has no user_id', () => {
    const token = new Token({ exp: 0 });
    req.headers.authorization = token.encode(config.secret());

    authToken()(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'It is highly recommended to inform these fields: sub and exp');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('should return 403 if a token token was decoded with another secret', () => {
    const token = new Token({ sub: 'b36d21fe-123f-4258-86d4-ed063b74414c', exp: 0 });
    req.headers.Authorization = token.encode('another-secret');

    authToken()(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'Signature verification failed');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('req should have payload property', () => {
    const token = Token.builder()
      .sub('25e1a524-01eb-4c42-b3b2-86280c5e61ca')
      .payload({ company_id: 'a2aa43db-eecf-4a23-9492-b70f4e17323b' })
      .build();
    req.headers.Authorization = token.encode(config.secret());

    authToken()(req, res, next);

    expect(req).to.have.property('payload');
    expect(req.payload).to.have.property('user_id', '25e1a524-01eb-4c42-b3b2-86280c5e61ca');
    expect(req.payload).to.have.property('company_id', 'a2aa43db-eecf-4a23-9492-b70f4e17323b');
  });
});
