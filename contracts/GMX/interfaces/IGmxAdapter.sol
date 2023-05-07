// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC20.sol";
import "./IRouter.sol";
import "./IPositionRouter.sol";

interface IGMXAdapter is IERC20, IRouter, IPositionRouter {
    function initialize(address _router, address _positionRouter) external;
    function approve(address token, address spender, uint256 amount) external;
    function createIncreasePosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);
    function createIncreasePositionETH(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);
    function withdrawToken(address token, address to, uint256 amount) external returns (bool);
    function withdrawEth(address to, uint256 amount) external returns (bool);
}