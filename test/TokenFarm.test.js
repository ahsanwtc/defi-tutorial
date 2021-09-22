import web3 from 'web3';
const { assert } = require('chai');

// eslint-disable-next-line no-undef
const TokenFarm = artifacts.require('TokenFarm');
// eslint-disable-next-line no-undef
const DappToken = artifacts.require('DappToken');
// eslint-disable-next-line no-undef
const DaiToken = artifacts.require('DaiToken');

require('chai')
  .use(require('chai-as-promised'))
  .should();

const tokens = n => web3.utils.toWei(n, 'ether');

// eslint-disable-next-line no-undef
contract('TokenFarm', accounts => {
  const [owner, investor] = accounts;
  let daiToken, dappToken, tokenFarm;

  // eslint-disable-next-line no-undef
  before(async () => {
    // Load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // Transfer all Dapp tokens to farm (1 Million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'));

    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner });
  });


  describe('Mock DAI deployment', async () => {

    it('has a name', async () => {
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    });

  });

  describe('Dapp Token deployment', async () => {

    it('has a name', async () => {
      const name = await dappToken.name();
      assert.equal(name, 'DApp Token');
    });

  });

  describe('TokenFarm deployment', async () => {

    it('has a name', async () => {
      const name = await tokenFarm.name();
      assert.equal(name, 'DApp Token Farm');
    });

    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'));
    });

  });
});