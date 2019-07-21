const sandbox = require('sinon').createSandbox();
const { assert } = require('chai');
const config = require('../src/config');
const { authorization } = require('../index');

describe('Authorization', () => {
  it('should return a function', () => {
    const response = authorization();
    assert.equal(response.length, 3);
  });
  it('should call correction function when production environment', () => {
    sandbox.stub(config, 'isProduction').returns(true);
    const response = authorization();
    assert.equal(response.length, 5);
    config.isProduction.restore();
  });
});
