// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract StablityFund is Ownable, ERC20("STLP", "STLP"), ReentrancyGuard {
    using SafeERC20 for IERC20;
    mapping(address => bool) public allowedToken;
    uint256 constant percent = 1000;
    address[] public tokenList;
    uint256 public swapFee;
    bool public flashLoanEnabled;

    constructor() {}

    function addStableToken(address _stableToken)
        external
        onlyOwner
        nonReentrant
    {
        require(
            allowedToken[_stableToken] == false,
            "This token is already added."
        );
        allowedToken[_stableToken] = true;
        tokenList.push(_stableToken);
    }

    function removeStableToken(address _stableToken)
        external
        onlyOwner
        nonReentrant
    {
        require(
            allowedToken[_stableToken] == true,
            "This token is not added or already removed."
        );
        require(
            IERC20Metadata(_stableToken).balanceOf(address(this)) == 0,
            "The balance should be zero."
        );
        allowedToken[_stableToken] = false;
        for (uint256 i = 0; i < tokenList.length; ++i) {
            if (tokenList[i] == _stableToken) {
                tokenList[i] = tokenList[tokenList.length - 1];
                tokenList[tokenList.length - 1] = _stableToken;
                break;
            }
        }
        tokenList.pop();
    }

    function setSwapFee(uint256 _fee) external onlyOwner nonReentrant {
        require(_fee > 0, "fee should not be zero.");
        swapFee = _fee;
    }

    function setFlashLoanAllowed(bool isEnabled)
        external
        onlyOwner
        nonReentrant
    {
        require(flashLoanEnabled != isEnabled, "Flag is already set.");
        flashLoanEnabled = isEnabled;
    }

    function Deposit(address _token, uint256 _amount) external nonReentrant {
        require(allowedToken[_token], "This token is not added.");
        require(_amount > 0, "Deposit amount should not be zero.");
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
    }

    function Swap(
        address _token0,
        uint256 _amount,
        address _token1
    ) external nonReentrant {
        require(
            allowedToken[_token0],
            "This token is not added or already removed."
        );
        require(
            allowedToken[_token1],
            "This token is not added or already removed."
        );
        require(_amount > 0, "Deposit amount should not be zero.");
        uint256 swapFeeAmount = (_amount * swapFee) / percent;
        uint256 tokenBalance = IERC20(_token1).balanceOf(address(this));
        require(_amount < tokenBalance, "Not enough liquidity.");

        IERC20(_token0).safeTransferFrom(msg.sender, address(this), _amount);
        IERC20(_token1).safeTransfer(msg.sender, _amount - swapFeeAmount);
    }

    function Withdraw(uint256 _amount) public nonReentrant {
        uint256 totalLPSupply = totalSupply();
        require(_amount > 0, "Deposit amount should not be zero.");
        for (uint256 i = 0; i < tokenList.length; ++i) {
            uint256 lpAmount = (IERC20(tokenList[i]).balanceOf(address(this)) *
                _amount) / totalLPSupply;
            IERC20(tokenList[i]).safeTransfer(msg.sender, lpAmount);
        }
        _burn(msg.sender, _amount);
    }

    function getTotalSupply() external view returns (uint256) {
        return totalSupply();
    }

    function getTotalValue() public view returns (uint256) {
        uint256 totalValue;

        for (uint256 i = 0; i < tokenList.length; ++i) {
            uint256 tokenAmount = ((IERC20Metadata(tokenList[i]).balanceOf(
                address(this)
            ) * 1e18) / (10**(IERC20Metadata(tokenList[i]).decimals())));
            totalValue += tokenAmount;
        }
        return totalValue;
    }

    function getLPTokenPrice() external view returns (uint256) {
        return (getTotalValue() * 1e18) / totalSupply();
    }
}
