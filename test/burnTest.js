var BigNumber = require('bignumber.js');
const BurnContract = artifacts.require('./BurnContract.sol')
const cVToken = artifacts.require('./cVTokenOnly/cVToken.sol')

const chai = require('chai');

const should = chai.should;

const OneToken = new BigNumber(web3.toWei(1, 'ether'));
const ZeroAddress = "0x0000000000000000000000000000000000000000";


contract('BurnContract', async (accounts) => {
  it('Initial burned total should be 0', async () => {
    const BurnContractInstance = await BurnContract.deployed()

    const BurnedAmount = await BurnContractInstance.getAmountBurned.call()

    assert.equal(BurnedAmount, 0, 'Initial burned amount is not equal to 1')
  });

  it('Initial burn child contract address should not be equal to 0x0', async ()=>{

    const BurnContractInstance = await BurnContract.deployed();

    const BurnChildContractAddress = await BurnContractInstance.getBurnContractAddress.call();

    assert.notEqual(BurnChildContractAddress,ZeroAddress,"Address is equal to 0x00, Probably constructor failed to create contract");

  });

  it('Contract should receive cV tokens', async ()=>{ //TODO modify after finding out how to test hardcoded variables

    let tokenInstance = await cVToken.deployed();
    await tokenInstance.changeTransferLock(0, {from: accounts[0]}); //Unlock token transfers

    let BurnInstance = await BurnContract.deployed();
    const BurnAddress = await BurnInstance.getAddress.call(); // get address of BurnInstance

    const amount_to_mint1 = OneToken.times(5000);
    const amount_to_mint2 = OneToken.times(10000);

    await tokenInstance.mint(accounts[1],amount_to_mint1.valueOf(), {from: accounts[0]}); //mint tokens to acc1
    await tokenInstance.mint(accounts[2],amount_to_mint2.valueOf(), {from: accounts[0]}); //mint tokens to acc2

    balanceAcc1 = BigNumber(await tokenInstance.balanceOf.call(accounts[1]));
    balanceAcc2 = BigNumber(await tokenInstance.balanceOf.call(accounts[2]));

    await tokenInstance.transfer(BurnAddress,balanceAcc1.valueOf(), {from: accounts[1]});
    await tokenInstance.transfer(BurnAddress,balanceAcc2.valueOf(), {from: accounts[2]});

    BalancePostTransfer = BigNumber(await tokenInstance.balanceOf.call(BurnAddress));
    const amount_to_be_received = balanceAcc1.plus(balanceAcc2);

    expect(BalancePostTransfer.valueOf()).to.equal(amount_to_be_received.valueOf());
  });

  it('Initial child contract owner should be 0x0', async()=>{

    const BurnInstance = await BurnContract.deployed();
    child_contract_owner = await BurnInstance.getBurnChildOwner.call();

    assert.equal(child_contract_owner,ZeroAddress,"Contract is not created or ownership not renounced")
  });

});
