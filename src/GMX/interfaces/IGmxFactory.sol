// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC20.sol";
import "./IRouter.sol";
import "./IPositionRouter.sol";

interface IGMXFactory {
    function openLongPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);

    function openLongPositionEth(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);

    function openShortPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);

    function openShortPositionEth(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);

    function closePosition(
        bytes32 positionId,
        address[] memory _path,
        uint256 _acceptablePrice,
        bool _withdrawETH
    ) external;
}
