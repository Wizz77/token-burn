const BurnContract = artifacts.require('./BurnContract.sol')

contract('BurnContract', async () => {
  it('Initial burned total should be 0', async () => {
    const BurnContractInstance = await BurnContract.deployed()

    const BurnedAmount = await BurnContractInstance.getAmountBurned.call()

    assert.equal(BurnedAmount, 0, 'Initial burned amount is not equal to 1')
  });

  it('Initial burn contract address should not be equal to 0x0', async ()=>{

    const BurnContractInstance = await BurnContract.deployed();

    const BurnContractAddress = await BurnContractInstance.getBurnContractAddress.call();

    assert.notEqual(BurnContractAddress,"0x0000000000000000000000000000000000000000","Address is equal to 0x00, Probably constructor failed to create contract");

  });

});
