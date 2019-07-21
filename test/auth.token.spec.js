const sinon = require('sinon');
const { expect } = require('chai');
const { authToken } = require('../index');
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
    expect(json.getCall(0).args[0]).to.have.property('error', 'Auth token not prensent in header');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('should return 403 if decoded token has no user_id', () => {
    req.headers['auth-token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21wYW55X2lkIjoiYTJhYTQzZGItZWVjZi00YTIzLTk0OTItYjcwZjRlMTczMjNiIn0.Hoq1tQrs9YhyJ7Pxo3Hxa7IWUaWx14fkGMTuD_OSE38';

    authToken()(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'You need to send an user_id to this request');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('should return 403 if a token token was decoded with another secret', () => {
    req.headers['auth-token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMjVlMWE1MjQtMDFlYi00YzQyLWIzYjItODYyODBjNWU2MWNhIiwiY29tcGFueV9pZCI6ImEyYWE0M2RiLWVlY2YtNGEyMy05NDkyLWI3MGY0ZTE3MzIzYiJ9.fORMdAPx8037hHjld3ZjHZoJMXnZvP8RlwiRtgMup-k';

    authToken()(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'Signature verification failed');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('req should have payload property', () => {
    req.headers['auth-token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMjVlMWE1MjQtMDFlYi00YzQyLWIzYjItODYyODBjNWU2MWNhIiwiY29tcGFueV9pZCI6ImEyYWE0M2RiLWVlY2YtNGEyMy05NDkyLWI3MGY0ZTE3MzIzYiJ9.3GjMH_0X1JkEr_2aVQgPo47yU_0OkYiCaai8f2q5HHY';

    authToken()(req, res, next);

    expect(req).to.have.property('payload');
    expect(req.payload).to.have.property('user_id', '25e1a524-01eb-4c42-b3b2-86280c5e61ca');
    expect(req.payload).to.have.property('company_id', 'a2aa43db-eecf-4a23-9492-b70f4e17323b');
  });
});
