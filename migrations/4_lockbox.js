var Lockbox = artifacts.require('./Lockbox.sol');

module.exports = function(deployer) {
  deployer.deploy(Lockbox);
};
