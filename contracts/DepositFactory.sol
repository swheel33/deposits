// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Deposit.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DepositFactory is Ownable{
    
    address public contractAddress;
    
    event DepositCreated(address newDepositAddress);

    function setContractAddress(address _contractAddress) public onlyOwner {
        contractAddress = _contractAddress;
    }
    
    function createDeposit(uint _depositValue, uint _agreedDate, address _token) public {
        address clone = Clones.clone(contractAddress);
        Deposit(clone).initialize(_depositValue, _agreedDate, _token);
        emit DepositCreated(clone);
    }
}