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

  describe('Farming Tokens', async () => {

    it('rewards investors for staking mDai tokens', async () => {
      // Check investor's balance before staking
      let result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking');

      // Stake Mock DAI Tokens
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
      await tokenFarm.stakeTokens(tokens('100'), { from: investor });
      
      // Check staking result
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking');

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens('100'), 'Token Farm DAI wallet balance correct after staking');

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking');

      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking');

      // Issue Tokens
      await tokenFarm.issueTokens({ from: owner });

      // Check blances after issuance
      result = await dappToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct after issuance');

      // Ensure that only owner can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor });

      // Check results after unstaking
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), '100', 'investor Mock DAI wallet balance correct after staking');

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking');

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking');

      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking');

    });

  });
});