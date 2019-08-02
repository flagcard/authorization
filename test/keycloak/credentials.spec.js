const sandbox = require('sinon').createSandbox();
const sinon = require('sinon');
const { expect } = require('chai');
const config = require('../../src/config');
const { credentials } = require('../..');

describe('Credentials', () => {
  const req = {};
  const res = {};
  let json;
  let next;
  beforeEach(() => {
    req.headers = {};
    json = sinon.fake();
    res.status = sinon.fake.returns(({ json }));
    res.setHeader = sinon.fake();
    res.end = sinon.fake();
    next = sinon.fake();
  });
  afterEach(() => {
    config.isProduction.restore();
  });
  it('should return default user_id for a non production environment', () => {
    sandbox.stub(config, 'isProduction').returns(false);

    credentials()(req, {}, sinon.fake());

    expect(req).to.have.property('user_id', 'e9fd456a-599c-4942-b249-fc457bb4b278');
  });
  it('should return forbidden for production without authorization', () => {
    sandbox.stub(config, 'isProduction').returns(true);

    credentials()(req, res, next);

    expect(res.status.called).to.be.equal(true);
    expect(res.status.getCall(0).args[0]).to.be.equal(403);
    expect(json.called).to.be.equal(true);
    expect(json.getCall(0).args[0]).to.have.property('error', 'Bearer Authorization is not prensent in header');
    expect(res.setHeader.called).to.be.equal(true);
    expect(next.notCalled).to.be.equal(true);
  });
  it('should call next function for a valid token', () => {
    sandbox.stub(config, 'isProduction').returns(true);
    req.headers.authorization = 'bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJIZkx3b3NKLW5YcXpxQnhOQmZrc3lQMWpGY3BiSjBVdEdSS3ZCSUJNUVdJIn0.eyJqdGkiOiI4MDVlODBmMC03MzljLTQ3OTktOGE1NC0yNDY0ZGViOTVhNGEiLCJleHAiOjE1NTg3MzA1MTgsIm5iZiI6MCwiaWF0IjoxNTU4NzMwMjE4LCJpc3MiOiJodHRwOi8vYXV0aC5mbGFnY2FyZC5jb20uYnIvYXV0aC9yZWFsbXMvZmxhZ2NhcmQiLCJhdWQiOiJyYWdhZGFzdCIsInN1YiI6ImY0ZWM4OTdkLTg0MjgtNGRkZS1hZTgxLTE4YzlkZGYyOTcwZiIsInR5cCI6IkJlYXJlciIsImF6cCI6InJhZ2FkYXN0IiwiYXV0aF90aW1lIjoxNTU4NzAxOTgyLCJzZXNzaW9uX3N0YXRlIjoiMzA5ZmQxMTAtZDY1NS00OTgzLTkwNTctMWYxNmJhZGQwZDU2IiwiYWNyIjoiMCIsImNsaWVudF9zZXNzaW9uIjoiZmEwZTA3YzMtMzUzZi00YjExLWJiYzYtMmUzMTRkMDk1MDgyIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInJvbGVfdXN1YXJpbyIsInJvbGVfYWRkX2F0dGVuZGFudCIsImZsYWdjYXJkLXJvbGUtc3RvcmUiLCJBRERfQVRURU5EQU5UIiwicm9sZV9lbXByZXNhIiwiU0VMTF9QUk9EVUNUIiwiZmFrZS1mb2RhIiwiQ0xPU0VfQk9YIiwicm9sZV9lc3RhYmVsZWNpbWVudG8iLCJmbGFnY2FyZC1yb2xlLXVzZXIiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZmxhZ2NhcmQtcm9sZS1jb21wYW55IiwiZmxhZ2NhcmQtcm9sZS1hZG1pbiIsIlBSSUNFU19BREQiXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwicmVhbG0tYWRtaW4iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwidmlldy1hdXRob3JpemF0aW9uIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sIm5hbWUiOiJEYXl2aXNvbiBMZW1vcyAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJmbGFnY2FyZCIsImdpdmVuX25hbWUiOiJEYXl2aXNvbiBMZW1vcyIsImVtYWlsIjoiIn0.iNbCdRqxLD3ltHv8Ydx-IjlfDIkK0-c7JYXpNNNCRoxg1oXSWfX8FlIdWDAVN8dwQk_f78BKhtp9Cfhxu_6tVmOa1EaD8x-vwBtSpMppkvq8_ApbmQiL032EHJm4K-EBGPQd2ET85SvNbcXdkvjumxPjK7FItsXLh7uxSO6Ehwq_isJ5YOv2XD_-HLGEZ6TrYylWLXq5gPweEieK4fTepKh9Gh7v80HlbftuLLX1fM3Ig1xft2wsmPjhEzUay460Mlr9OdEqG-vu9KC7EEzIW58Mz6I-1Ec7KRRf_Jm8GK57xO58mD3tgd8Den74ixuqy-L6jQanKtAppEuuozyjsg';

    credentials()(req, res, next);

    expect(req.user_id).to.be.equal('f4ec897d-8428-4dde-ae81-18c9ddf2970f');
    expect(res.end.notCalled).to.be.equal(true);
    expect(res.setHeader.notCalled).to.be.equal(true);
    expect(next.called).to.be.equal(true);
  });
});
