pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "TokenFarm";
    string public symbol = "TF";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    // type --> smart contract name
    // pass dapptoken and daitoken address
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }

    // Deposit
    function stake(uint256 _amount) public payable {
        // transfer from investor to this contract
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // add to staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // stakers.push(msg.sender);
        //disallow multiple entries
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // withdraw
    function unstake(uint256 _amount) public {
        dappToken.transfer(msg.sender, _amount);
    }

    // issue tokens
}
