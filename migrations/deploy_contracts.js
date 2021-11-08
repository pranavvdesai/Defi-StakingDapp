const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm")

module.exports = async function(deployer, network, accounts) {
    // Deploy Tokens and get the address of the deployed token
    await deployer.deploy(DaiToken);

    const daiTokenAddress = await DaiToken.deployed();

    await deployer.deploy(DappToken);

    const dappTokenAddress = await DappToken.deployed();

   
    await deployer.deploy(TokenFarm, dappTokenAddress.address, daiTokenAddress.address);

    
    const tokenFarmAddress = await TokenFarm.deployed();


    await dappTokenAddress.transfer(tokenFarmAddress.address, '1000000000000000000000000');

    // Transfer 100 Mock Dai Tokens to investor
    // treating second account as investor
    await daiTokenAddress.transfer(accounts[1], '1000000000000000000000000');
};
