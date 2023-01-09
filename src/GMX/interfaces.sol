// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IRouter {
    function swapETHToTokens(
        address[] memory _path,
        uint256 _minOut,
        address _receiver
    ) external payable;

    function approvePlugin(address _plugin) external;
}

interface IPositionRouter {
    function createIncreasePositionETH(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice,
        uint256 _executionFee,
        bytes32 _referralCode
    ) external payable;

    function minExecutionFee() external returns (uint256);

    function getRequestQueueLengths()
        external
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        );

    function increasePositionsIndex(address) external returns (uint256);

    function getRequestKey(address _account, uint256 _index)
        external
        pure
        returns (bytes32);

    function cancelIncreasePosition(
        bytes32 _key,
        address payable _executionFeeReceiver
    ) external returns (bool);

    function admin() external returns (address);

    function setPositionKeeper(address _account, bool _isActive) external;

    function isPositionKeeper(address) external returns (bool);

    function executeIncreasePositions(
        uint256 _endIndex,
        address payable _executionFeeReceiver
    ) external;
}
