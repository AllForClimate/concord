// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract KiezDAO {

    event Received(address, uint);
    event Spent(address, uint);
    
    constructor() payable {}

    // Shoot 1 ETH to caller
    function addProposal() public payable {
        require (address(this).balance > 1 wei, "NO_MONEY");
        payable(msg.sender).transfer(1 ether);
        emit Spent(msg.sender, msg.value);
    }

    // Donors just donate
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
    
    // for tests
    function checkBalance() public view returns(uint256){
        return address(this).balance;
    }
}