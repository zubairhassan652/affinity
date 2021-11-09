const AffinityToken = artifacts.require("AffinityToken");

module.exports = function (deployer) {
  deployer.deploy(AffinityToken);
};