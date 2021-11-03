pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "TokenFarm";
    string public symbol = "TF";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    // type --> smart contract name
    // pass dapptoken and daitoken address
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // Deposit
    function stake(uint256 _amount) public payable {
        // require amount to be greater than 0
        require(_amount > 0,"Amount must be greater than 0");

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
    function issue() public {
        // only owner can call this function
        require(msg.sender == owner, "Only owner can issue tokens");
        for (uint i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint Balance = stakingBalance[staker];
            if(Balance>0){
                dappToken.transfer(staker, Balance);
            }
        }
     }
}
