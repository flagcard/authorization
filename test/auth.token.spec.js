const sinon = require('sinon');
const { expect } = require('chai');
const { authToken } = require('../index');

describe('Auth Token', () => {
  it('should return 403 if no auth-token provider', () => {
    const req = {
      headers: {},
    };
    const res = {
      end: sinon.fake(),
      setHeader: sinon.fake(),
    };
    const next = sinon.fake();
    authToken()(req, res, next);
    expect(res.statusCode).to.be.equal(403);
    expect(res.end.called).to.be.equal(true);
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('should return 403 if decoded token has no user_id', () => {
    const req = {
      headers: {
        'auth-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21wYW55X2lkIjoiYTJhYTQzZGItZWVjZi00YTIzLTk0OTItYjcwZjRlMTczMjNiIn0.Hoq1tQrs9YhyJ7Pxo3Hxa7IWUaWx14fkGMTuD_OSE38',
      },
    };
    const res = {
      end: sinon.fake(),
      setHeader: sinon.fake(),
    };
    const next = sinon.fake();
    authToken()(req, res, next);
    expect(res.statusCode).to.be.equal(403);
    expect(res.end.called).to.be.equal(true);
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('should return 403 if a token token was decoded with another secret', () => {
    const req = {
      headers: {
        'auth-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMjVlMWE1MjQtMDFlYi00YzQyLWIzYjItODYyODBjNWU2MWNhIiwiY29tcGFueV9pZCI6ImEyYWE0M2RiLWVlY2YtNGEyMy05NDkyLWI3MGY0ZTE3MzIzYiJ9.fORMdAPx8037hHjld3ZjHZoJMXnZvP8RlwiRtgMup-k',
      },
    };
    const res = {
      end: sinon.fake(),
      setHeader: sinon.fake(),
    };
    const next = sinon.fake();
    authToken()(req, res, next);
    expect(res.statusCode).to.be.equal(403);
    expect(res.end.called).to.be.equal(true);
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('req should have payload property', () => {
    const req = {
      headers: {
        'auth-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMjVlMWE1MjQtMDFlYi00YzQyLWIzYjItODYyODBjNWU2MWNhIiwiY29tcGFueV9pZCI6ImEyYWE0M2RiLWVlY2YtNGEyMy05NDkyLWI3MGY0ZTE3MzIzYiJ9.3GjMH_0X1JkEr_2aVQgPo47yU_0OkYiCaai8f2q5HHY',
      },
    };
    const res = {
      end: sinon.fake(),
      setHeader: sinon.fake(),
    };
    const next = sinon.fake();
    authToken()(req, res, next);
    expect(req).to.have.property('payload');
    expect(req.payload).to.have.property('user_id', '25e1a524-01eb-4c42-b3b2-86280c5e61ca');
    expect(req.payload).to.have.property('company_id', 'a2aa43db-eecf-4a23-9492-b70f4e17323b');
  });
});
