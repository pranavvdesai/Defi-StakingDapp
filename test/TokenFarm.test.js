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
    });
})
