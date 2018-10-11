pragma solidity ^0.4.24;

import "./IERC20.sol";
import "./ERC20.sol";
import "./SafeERC20.sol";
import "./SafeMath.sol";

contract BurnContract{

  IERC20 public cVToken;
  address public constant burnAddress = address(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
  uint256 public AmountBurned;

  uint256 private previousBurnBalance;

  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  constructor(IERC20 _cVToken)public{
    AmountBurned = 0;
    cVToken = _cVToken;
    previousBurnBalance = 0;
  }

  event Burned(uint256 amount);

  function Burn() public returns(bool){

    uint256 contractBalance = cVToken.balanceOf(address(this)); //Take current t
    cVToken.safeTransfer(burnAddress, contractBalance);

    uint256 currentBurnBalance = cVToken.balanceOf(burnAddress);

    uint256 BurnedAmount = currentBurnBalance.sub(previousBurnBalance);

    emit Burned(BurnedAmount);

    AmountBurned = currentBurnBalance;
    previousBurnBalance = AmountBurned;

    return true;

  }

  function getToken()public view returns(IERC20){
    return cVToken;
  }

  function getAmountBurned()public view returns(uint256){
    return AmountBurned;
  }

  function getAddress()public view returns(address){
    return address(this);
  }

  function getBurnAddress()public view returns(address){
    return address(burnAddress);
  }

}
