//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract Deposit is Initializable {
    IERC20 private token;
    uint private depositValue;
    address payable private seller;
    address payable private buyer;
    uint private agreedDate;
    uint private deadline;

    enum State {Created, Locked, Inactive}
    State public state;

    ///Please wait until the agreed upon date to contenst
    error NotOnAgreedDate();

    ///The contract is not in the correct state to call this function
    error InvalidState();

    ///Only the buyer can call this function
    error OnlyBuyer();

    ///Only the seller can call this function
    error OnlySeller();

    ///Please wait 24 hours after the agreed upon date to claim
    error NotAfterAgreedDate();


    event ContestComplete();
    event ClaimComplete();
    
    modifier onAgreedDate() {
        if (block.timestamp < agreedDate || block.timestamp > deadline) {
            revert NotOnAgreedDate();
        }
        _;
    }

    modifier afterAgreedDate() {
        if(block.timestamp <= deadline) {
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

    function initialize(uint _depositValue, uint _agreedDate, address _token, address payable _seller) initializer public {
        seller = _seller;
        depositValue = _depositValue;
        agreedDate = _agreedDate;
        deadline = agreedDate + 1 days;
        token = IERC20(_token);
    }


    //Getters
    function getDepositValue() public view returns(uint) {
        return depositValue;
    }

    function getAgreedDate() public view returns(uint) {
        return agreedDate;
    }

    function getSeller() public view returns(address) {
        return seller;
    }

    function getBuyer() public view returns(address) {
        return buyer;
    }

    function getDeadline() public view returns(uint) {
        return deadline;
    }

    function getCurrentState() public view returns(string memory) {
        if (state == State.Created) return "Created";
        if (state == State.Locked) return "Locked";
        if (state == State.Inactive) return "Inactive";
    }

    function confirmDeposit() external payable inState(State.Created) {
        buyer = payable(msg.sender);
        state = State.Locked;
        token.transferFrom(msg.sender, address(this), depositValue);
    }

    function contestItem() external onlyBuyer onAgreedDate inState(State.Locked) {
        state = State.Inactive;
        token.transfer(buyer, depositValue);
        emit ContestComplete();
    }

    function claimFunds() external onlySeller afterAgreedDate inState(State.Locked) {
        state = State.Inactive;
        token.transfer(seller, depositValue);
        emit ClaimComplete();
    }

}
