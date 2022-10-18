// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "hardhat/console.sol";

contract TestToken is Ownable, ERC20("TEST", "TEST"), ReentrancyGuard {
    using SafeERC20 for IERC20;
    address public FACTORY;
    address public ROUTER;

    constructor(address _factory, address _router) payable {
        FACTORY = _factory;
        ROUTER = _router;
    }

    function mint(address _to, uint256 amount) public {
        _mint(_to, amount);
    }

    function addLiquidity() external payable {
        _mint(address(this), 1000 ether);
        IERC20(address(this)).safeApprove(ROUTER, 1000 ether);
        uint256 ethBal = address(this).balance;
        IUniswapV2Router(ROUTER).addLiquidityETH{value: ethBal}(
            address(this),
            1000 ether,
            1000 ether,
            0,
            msg.sender,
            block.timestamp
        );
    }

    function transferToken(
        address _from,
        address _to,
        uint256 _amount
    ) public nonReentrant {
        require(_amount > 0, "Amount should not be zero");

        uint256 transferFee = (_amount * 100) / 1000;
        _transfer(_from, _to, _amount - transferFee);
        _transfer(_from, address(this), transferFee);

        if (balanceOf(address(this)) > 10 ether) {
            uint256 testTokenBalance = balanceOf(address(this));
            IERC20(address(this)).safeApprove(ROUTER, testTokenBalance);
            address[] memory path = new address[](2);
            path[0] = address(this);
            path[1] = IUniswapV2Router(ROUTER).WETH();
            IUniswapV2Router(ROUTER).swapExactTokensForETH(
                testTokenBalance,
                0,
                path,
                address(this),
                block.timestamp
            );
        }
    }

    function withdrawETH() public onlyOwner nonReentrant {
        uint256 ethBalance = address(this).balance;
        (bool sent, ) = payable(msg.sender).call{value: ethBalance}("");
    }

    receive() external payable {}
}

interface IUniswapV2Router {
    function WETH() external pure returns (address);

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

interface IUniswapV2Factory {
    function getPair(address token0, address token1)
        external
        view
        returns (address);

    function createPair(address tokenA, address tokenB)
        external
        returns (address pair);
}
