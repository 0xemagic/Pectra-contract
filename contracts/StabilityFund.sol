// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StablityFund is Ownable  {
    mapping(address=>bool) public allowedToken;
    IERC20 STLP;
    uint256 public swapFee;
    bool flashLoanEnabled;
    constructor(IERC20 _STLP) {
        STLP = _STLP;
    }

    function addStableToken(address _stableToken) onlyOwner public {
        require(allowedToken[_stableToken] == false, "This token is already added.");
        allowedToken[_stableToken] = true;
    }

    function removeStableToken(address _stableToken) onlyOwner public {
        require(allowedToken[_stableToken] == true, "This token is not added or already removed.");
        allowedToken[_stableToken] = false;
    }

    function setSwapFee(uint256 _fee) onlyOwner public {
        require(_fee > 0, "fee should not be zero.");
        swapFee = _fee;
    }

    function setFlashLoanAllowed() onlyOwner public {
        require(flashLoanEnabled, "Flashloan is already enabled.");
        flashLoanEnabled = true;
    }
}