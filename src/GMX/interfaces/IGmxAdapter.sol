// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC20.sol";
import "./IRouter.sol";
import "./IPositionRouter.sol";

interface IGMXAdapter is IERC20, IRouter, IPositionRouter {
    function withdrawToken(address token, address to, uint256 amount) external returns (bool);
}