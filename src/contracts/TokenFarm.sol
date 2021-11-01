pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm{
    string public name = "TokenFarm";
    string public symbol = "TF";
    DappToken public dappToken;
    DaiToken public daiToken;

    mapping(address => uint) public stakingBalance


    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    
    }

    // Deposit
    function stake(uint _amount) public payable{

        // transfer from investor to this contract
        daiToken.transferFrom(msg.sender,address(this), _amount);
    
        // add to staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
    
    }
    // withdraw
    function unstake(uint _amount) public{
        dappToken.transfer(msg.sender, _amount);
    }

    // issue tokens
}