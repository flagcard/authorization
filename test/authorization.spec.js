const sandbox = require('sinon').createSandbox();
const { assert } = require('chai');
const environment = require('../src/keycloak/environment');
const { authorization } = require('../index');

describe('Authorization', () => {
  it('should return a function', () => {
    const response = authorization();
    assert.equal(response.length, 3);
  });
  it('should call correction function when production environment', () => {
    sandbox.stub(environment, 'isProduction').returns(true);
    const response = authorization();
    assert.equal(response.length, 5);
    environment.isProduction.restore();
  });
});
