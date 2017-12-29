pragma solidity ^0.4.17;

contract AreYouTheOwner {
  address public owner = msg.sender;

  function areYouTheOwner() public view returns (bool) {
    return msg.sender == owner;
  }

}