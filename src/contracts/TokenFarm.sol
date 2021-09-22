pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
  string public name = "DApp Token Farm";
  DaiToken public daiToken;
  DappToken public dappToken;

  address[] public stakers;
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor (DappToken _dappToken, DaiToken _daiToken) public {
    dappToken = _dappToken;
    daiToken = _daiToken;
  }

  function stakeTokens(uint _amount) public {
    // Transfer Mock Dai tokens to this contract fro staking
    daiToken.transferFrom(msg.sender, address(this), _amount);

    // Updating staking balance
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

    // Add user to stakers array iff they haven't staked already
    if (!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    // Updating staking status
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
  }

}