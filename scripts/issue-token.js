// eslint-disable-next-line no-undef
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async callback => {
  let tokenFarm = await TokenFarm.deployed();
  await tokenFarm.issueTokens();
  
  console.log('tokens issued');
  callback();
};