pragma solidity ^0.4.24;

import "./IERC20.sol";
import "./Ownable.sol";
import "./ERC20.sol";
import "./SafeERC20.sol";
import "./SafeMath.sol";

contract BurnContract{

  IERC20 public constant cVToken = IERC20(0xafff042f602762b59442660acdf34fde8681d016);
  address public BurnStorageContract;
  uint256 public AmountBurned;

  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  constructor(){
    AmountBurned = 0;
    bytes32 name = "BurnStorage";
    BurnStorageContract = new BurnStorage(name);
  }

  event Burned(uint256 amount);


  function Burn() public returns(bool){

    uint256 contractBalance = cVToken.balanceOf(address(this));
    cVToken.safeTransfer(BurnStorageContract, contractBalance);
    AmountBurned = AmountBurned.add(contractBalance);
    emit Burned(contractBalance);
    return true;

  }

}

contract BurnStorage is Ownable {
    bytes32 public Name;

    constructor(bytes32 name){
        Name = name;
      renounceOwnership();
    }

}


//0xa4f4d8ff4d52ab7d69035d4504661d730f74a24c
