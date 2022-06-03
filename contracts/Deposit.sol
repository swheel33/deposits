//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract Deposit is Initializable {
    IERC20 private token;
    uint public depositValue;
    address payable public seller;
    address payable public buyer;
    uint public agreedDate;

    enum State {Created, Locked, Inactive}
    State public state;

    ///Not on the agreed date of transaction
    error NotOnAgreedDate();

    ///The contract is not in the correct state to call this function
    error InvalidState();

    ///Only the buyer can call this function
    error OnlyBuyer();

    ///Only the seller can call this function
    error OnlySeller();

    ///Please wait 24 hours from the agreed date to claim
    error NotAfterAgreedDate();


    event ContestComplete();
    event ClaimComplete();
    
    modifier onAgreedDate() {
        if (block.timestamp < agreedDate || block.timestamp >= agreedDate + 1 days) {
            revert NotOnAgreedDate();
        }
        _;
    }

    modifier afterAgreedDate() {
        if(block.timestamp <= agreedDate + 1 days) {
            revert NotAfterAgreedDate();
        }
        _;
            
    }

    modifier onlyBuyer() {
        if (msg.sender != buyer) {
            revert OnlyBuyer();
        }
        _;
    }

    modifier onlySeller() {
        if (msg.sender != seller) {
            revert OnlySeller();
        }
        _;
    }

    modifier inState(State state_) {
        if (state != state_)
            revert InvalidState();
        _;
    }

    function initialize(uint _depositValue, uint _agreedDate, address _token) initializer public {
        seller = payable(msg.sender);
        depositValue = _depositValue;
        agreedDate = _agreedDate;
        token = IERC20(_token);
    }


    function confirmDeposit() external payable inState(State.Created) {
        buyer = payable(msg.sender);
        state = State.Locked;
        token.transferFrom(msg.sender, address(this), depositValue);
    }

    function contestItem() external onlyBuyer inState(State.Locked) {
        state = State.Inactive;
        token.transfer(buyer, depositValue);
        emit ContestComplete();
    }

    function claimFunds() external onlySeller inState(State.Locked) {
        state = State.Inactive;
        token.transfer(seller, depositValue);
        emit ClaimComplete();
    }

}
