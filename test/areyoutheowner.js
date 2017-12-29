var AreYouTheOwner = artifacts.require('AreYouTheOwner');

contract('AreYouTheOwner', (accounts) => {

  it('returns true when called by the contract owner', () => {
    return AreYouTheOwner.deployed().then((instance) => {
      return instance.areYouTheOwner.call().then((value) => {
        assert.equal(value, true);
      });
    });
  });

  it('returns false when called by anyone else', () => {
    return AreYouTheOwner.deployed().then((instance) => {
      return instance.areYouTheOwner.call({from: accounts[1]}).then((value) => {
        assert.equal(value, false);
      });
    });
  });

});
