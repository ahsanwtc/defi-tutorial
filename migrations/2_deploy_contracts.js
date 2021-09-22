// eslint-disable-next-line no-undef
const TokenFarm = artifacts.require('TokenFarm');
// eslint-disable-next-line no-undef
const DappToken = artifacts.require('DappToken');
// eslint-disable-next-line no-undef
const DaiToken = artifacts.require('DaiToken');

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock Dai Token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  // Deploy Dapp Token
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transfer all tokens to TokenFarm (1 Million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // Transfer 100 Mock Dai tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000');
};
