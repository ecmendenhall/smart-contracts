var JustZero = artifacts.require('JustZero');

contract('JustZero', (accounts) => {

  it('just returns a zero', () => {
    return JustZero.deployed().then((instance) => {
      return instance.thisAlwaysReturnsZero.call().then((value) => {
        assert.equal(value, 0);
      });
    });
  });

});
