var AreYouTheOwner = artifacts.require('./AreYouTheOwner.sol');

module.exports = function(deployer) {
  deployer.deploy(AreYouTheOwner);
};
