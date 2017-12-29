pragma solidity ^0.4.17;

contract Lockbox {

  enum State {
    Unlocked,
    Locked
  }

  address public owner = msg.sender;
  State public state = State.Unlocked;

  modifier byOwner() {
    if (msg.sender == owner) {
      _;
    }
  }

  modifier whenUnlocked() {
    if (state == State.Unlocked) {
      _;
    }
  }

  function balance() public view returns (uint256) {
    address contractAddress = this;
    return contractAddress.balance;
  }

  function lock() public byOwner() {
    state = State.Locked;
  }

  function unlock() public byOwner() {
    state = State.Unlocked;
  }

  function sendBalance(address recipient) public whenUnlocked() {
    recipient.transfer(this.balance());
  }

  function() public payable { }

}