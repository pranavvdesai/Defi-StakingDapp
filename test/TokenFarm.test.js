const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm")

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n.toString(), 'ether')
}

contract('TokenFarm',(/*accounts*/[owner, investor])=>{
    let daiToken, dappToken, tokenFarm;
    before(async () => {
        // load contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // transfer all dapp tokens to token farm
        await dappToken.transfer(tokenFarm.address, tokens(10000))
        console.log("Token Farm Address: ", tokenFarm.address)

        // send tokens to investor
        await daiToken.transfer(investor, tokens(1000),{from: owner})
    });
    describe('Mock Dai Deployment', async () => {
        it('has a name', async()=>{
            const name = await daiToken.name()
            assert.equal(name ,"Mock DAI Token");
        })
    });
    describe('Dapp Deployment', async () => {
        it('has a name', async()=>{
            const name = await dappToken.name()
            assert.equal(name ,"DApp Token");
        })
    });
    describe('Token Farm Deployment', async () => {
        it('has a name', async()=>{
            const name = await tokenFarm.name()
            assert.equal(name ,"TokenFarm");
        })
   
        it('contract has tokens', async()=>{
            const balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('10000'));
        })
    });

    describe('Farming Tokens', async () => {
        it('rewards investors for staking mDai tokens', async()=>{

            //check investor balance before staking
            const investorBalanceBefore = await daiToken.balanceOf(investor);
            assert.equal(investorBalanceBefore.toString(), tokens('1000'), 'investor mock DAI wallet balance shld be correct before staking');
            
            // stake mock DAI tokens
            await daiToken.approve(tokenFarm.address, tokens('1000'), {from: investor})
            await tokenFarm.stake(tokens('1000'), {from: investor})

            // check investor balance after staking
            const investorBalanceAfter = await daiToken.balanceOf(investor);
            assert.equal(investorBalanceAfter.toString(), tokens('0'), 'investor mock DAI wallet balance shld be correct after staking');

            // check token farm balance after staking
            const tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('1000'), 'token farm mock DAI wallet balance shld be correct after staking');
           
            // check stakingBalance
            const stakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(stakingBalance.toString(), tokens('1000'), 'investor staking balance shld be correct after staking');

            // check current status
            const currentStatus = await tokenFarm.isStaking(investor);
            assert.equal(currentStatus.toString(), 'true', 'current status shld be correct after staking');
        
            await tokenFarm.issue({from: owner})

            // ensure that only owner can issue tokens
            await tokenFarm.issue({from: investor}).should.be.rejectedWith('revert');

            // check balance after issuing
            const investorBalanceAfterissue = await dappToken.balanceOf(investor);
            assert.equal(investorBalanceAfterissue.toString(), tokens('1000'), 'token farm dapp wallet balance shld be correct after issuing');

            // check token farm balance after issuing
            const tokenFarmBalanceAfterissue = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalanceAfterissue.toString(), tokens('9000'), 'token farm dapp wallet balance shld be correct after issuing');
        
            // unstake tokens
            await tokenFarm.unstake({from: investor})

            // check investor balance after unstaking
            const investorBalanceAfterunstake = await daiToken.balanceOf(investor);
            assert.equal(investorBalanceAfterunstake.toString(), tokens('1000'), 'investor mock DAI wallet balance shld be correct after unstaking');

            // check token farm balance after unstaking
            const tokenFarmBalanceAfterunstake = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalanceAfterunstake.toString(), tokens('0'), 'token farm mock DAI wallet balance shld be correct after unstaking');

            // check stakingBalance
            const stakingBalanceAfterunstake = await tokenFarm.stakingBalance(investor);
            assert.equal(stakingBalanceAfterunstake.toString(), tokens('0'), 'investor staking balance shld be correct after unstaking');

            // // check dapp token balance after unstaking
            const dappTokenBalanceAfterunstake = await dappToken.balanceOf(investor);
            assert.equal(dappTokenBalanceAfterunstake.toString(), tokens('1000'), 'investor dapp token wallet balance shld be correct after unstaking');




        })
    });
})
