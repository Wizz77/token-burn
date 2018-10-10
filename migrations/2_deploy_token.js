var CvToken = artifacts.require("./cVTokenOnly/cVToken.sol");

module.exports = function(deployer) {
  deployer.deploy(CvToken);
};
