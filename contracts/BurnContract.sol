pragma solidity ^0.4.24;

import "./IERC20.sol";
import "./Ownable.sol";
import "./ERC20.sol";
import "./SafeERC20.sol";
import "./SafeMath.sol";

contract BurnContract{

  IERC20 public cVToken; //TODO hardcode
  address public BurnStorageContract;
  uint256 public AmountBurned;

  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  constructor()public{
    AmountBurned = 0;
    bytes32 name = "BurnStorage";
    BurnStorageContract = new BurnStorage(name);
  }

  event Burned(uint256 amount);

  function setToken(IERC20 _tokenAddress){
    cVToken = _tokenAddress;
  }

  function Burn() public returns(bool){

    uint256 contractBalance = cVToken.balanceOf(address(this));
    cVToken.safeTransfer(BurnStorageContract, contractBalance);
    AmountBurned = AmountBurned.add(contractBalance);
    emit Burned(contractBalance);
    return true;

  }

  function getToken()public view returns(IERC20){
    return cVToken;
  }

  function getBurnContractAddress()public view returns(address){
    return BurnStorageContract;
  }

  function getAmountBurned()public view returns(uint256){
    return AmountBurned;
  }

  function getBurnStorageBalance()public view returns(uint256){
    return cVToken.balanceOf(BurnStorageContract);
  }

  function getAddress()public view returns(address){
    return address(this);
  }

}

contract BurnStorage is Ownable {
    bytes32 public Name;

    constructor(bytes32 name)public{
        Name = name;
      renounceOwnership();
    }

}
