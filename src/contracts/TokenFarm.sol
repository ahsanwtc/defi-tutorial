pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
  string public name = "DApp Token Farm";
  DaiToken public daiToken;
  DappToken public dappToken;
  address public owner;

  address[] public stakers;
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor (DappToken _dappToken, DaiToken _daiToken) public {
    dappToken = _dappToken;
    daiToken = _daiToken;
    owner = msg.sender;
  }

  function stakeTokens(uint _amount) public {
    // Require amount greater than 0
    require(_amount > 0, "amount can't be 0");

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

  function issueTokens() public {
    require(msg.sender == owner, "caller must be owner");
    
    for(uint i = 0; i < stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if (balance > 0) {
        dappToken.transfer(recipient, balance);
      }
    }
  }

  function unstakeTokens() public {
    // Fetch staking balance
    uint balance = stakingBalance[msg.sender];

    // Require amount greater than 0
    require(balance > 0, "staking balance cannot be 0");

    // Transfer Mock Dai tokens to caller
    daiToken.transfer(msg.sender, balance);

    // Reset staking balance
    stakingBalance[msg.sender] = 0;

    // Update staking status
    isStaking[msg.sender] = false;
  }

}