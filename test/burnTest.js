var BigNumber = require('bignumber.js');
const BurnContract = artifacts.require('./BurnContract.sol')
const cVToken = artifacts.require('./cVTokenOnly/cVToken.sol')

const chai = require('chai');

const should = chai.should;

const OneToken = new BigNumber(web3.toWei(1, 'ether'));
const ZeroAddress = "0x0000000000000000000000000000000000000000";

const amount_to_mint1 = BigNumber(OneToken.times(465570989))
const amount_to_mint2 = BigNumber(OneToken.times(465573989))

contract('BurnContract', async (accounts) => {
  it('Initial burned total should be 0', async () => {
    const BurnInstance = await BurnContract.deployed()

    const BurnedAmount = BigNumber(await BurnInstance.getAmountBurned.call());

    assert.equal(BurnedAmount.valueOf(), 0, 'Initial burned amount is not equal to 0')
  });

  it('Initial burn child contract address should not be equal to 0x0', async ()=>{

    const BurnInstance = await BurnContract.deployed();

    const BurnChildContractAddress = await BurnInstance.getBurnContractAddress.call();

    assert.notEqual(BurnChildContractAddress,ZeroAddress,"Address is equal to 0x00, Probably constructor failed to create contract");



  });

  it('Contract should receive cV tokens', async ()=>{ //TODO modify after finding out how to test hardcoded variables

    tokenInstance = await cVToken.deployed();
    await tokenInstance.changeTransferLock(0, {from: accounts[0]}); //Unlock token transfers

    BurnInstance = await BurnContract.deployed();
    const BurnAddress = await BurnInstance.getAddress.call(); // get address of BurnInstance

    await tokenInstance.mint(accounts[1],amount_to_mint1.valueOf(), {from: accounts[0]}); //mint tokens to acc1
    await tokenInstance.mint(accounts[2],amount_to_mint2.valueOf(), {from: accounts[0]}); //mint tokens to acc2

    balanceAcc1 = BigNumber(await tokenInstance.balanceOf.call(accounts[1]));
    balanceAcc2 = BigNumber(await tokenInstance.balanceOf.call(accounts[2]));
    expect(balanceAcc1.valueOf()).to.equal(amount_to_mint1.valueOf());
    expect(balanceAcc2.valueOf()).to.equal(amount_to_mint2.valueOf());

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

  it('Burn mechanism should work properly', async()=>{

    const tokenInstance = await cVToken.deployed();
    const BurnInstance = await BurnContract.deployed();

    await tokenInstance.changeTransferLock(0, {from: accounts[0]});
    const BurnAddress = await BurnInstance.getAddress.call();

    await tokenInstance.mint(BurnAddress,amount_to_mint1.valueOf(), {from: accounts[0]});

    await BurnInstance.Burn({from: accounts[1]});

    BurnChildBalance = BigNumber(await BurnInstance.getBurnStorageBalance.call());
    AmountBurned = BigNumber(await BurnInstance.getAmountBurned.call());
    ContractBalanceAfterBurn = BigNumber(await tokenInstance.balanceOf(BurnAddress))

    assert.equal(BurnChildBalance.valueOf(),AmountBurned.valueOf(),"Amount burned and burn child amount does not match");
    assert.equal(ContractBalanceAfterBurn.valueOf(),0,"Contract still holds tokens, burn does not work properly");
  });

  it('Burn mechanism should work properly after multiple transfers', async()=>{

    tokenInstance = await cVToken.deployed();
    await tokenInstance.changeTransferLock(0, {from: accounts[0]}); //Unlock token transfers

    BurnInstance = await BurnContract.deployed();
    const BurnAddress = await BurnInstance.getAddress.call(); //

    await tokenInstance.mint(accounts[1],amount_to_mint1.valueOf(), {from: accounts[0]}); //mint tokens to acc1
    await tokenInstance.mint(accounts[2],amount_to_mint2.valueOf(), {from: accounts[0]}); //mint tokens to acc2

    balanceAcc1 = BigNumber(await tokenInstance.balanceOf.call(accounts[1]));
    balanceAcc2 = BigNumber(await tokenInstance.balanceOf.call(accounts[2]));

    await tokenInstance.transfer(BurnAddress,balanceAcc1.valueOf(), {from: accounts[1]});

    await BurnInstance.Burn({from: accounts[2]});
    ContractBalanceAfterBurn1 = BigNumber(await tokenInstance.balanceOf(BurnAddress))
    assert.equal(ContractBalanceAfterBurn1.valueOf(),0,"Contract still holds tokens, burn does not work properly, after 1 account transfer and 2 account call");

    await tokenInstance.transfer(BurnAddress,balanceAcc2.valueOf(), {from: accounts[2]});
    await BurnInstance.Burn({from: accounts[1]});
    ContractBalanceAfterBurn2 = BigNumber(await tokenInstance.balanceOf(BurnAddress))
    assert.equal(ContractBalanceAfterBurn2.valueOf(),0,"Contract still holds tokens, burn does not work properly, after 2 account transfer and 1 account call");

    TotalBurn = BigNumber(await BurnInstance.getAmountBurned.call());

    BurnChildBalance = BigNumber(await BurnInstance.getBurnStorageBalance.call());

    balanceAcc1 = BigNumber(await tokenInstance.balanceOf.call(accounts[1]));
    balanceAcc2 = BigNumber(await tokenInstance.balanceOf.call(accounts[2]));

    assert.equal(BurnChildBalance.valueOf(),TotalBurn.valueOf(),"Tokens burned does not match burn child balance");
    assert.equal(balanceAcc1.valueOf(),0,"Account 1 still has tokens left");
    assert.equal(balanceAcc2.valueOf(),0,"Account 2 still has tokens left");
  });

});
