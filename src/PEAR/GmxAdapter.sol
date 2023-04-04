// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
import "../GMX/interfaces/IRouter.sol";
import "../GMX/interfaces/IPositionRouter.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GMXAdapter is AccessControl {

    bytes32 public constant USER_ROLE = keccak256("USER");

    address public ROUTER;
    address public POSITION_ROUTER;
    
    constructor(address _router, address _positionRouter, address _user) {
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(USER_ROLE, DEFAULT_ADMIN_ROLE);
        grantRole(USER_ROLE, msg.sender);
        grantRole(USER_ROLE, _user);
    }

    receive() external payable {}

    function approve(address token, address spender, uint256 amount) external onlyRole(USER_ROLE) returns (bool) {
        return IERC20(token).approve(spender, amount);
    }

    function approvePlugin(address _plugin) external onlyRole(USER_ROLE) {
        IRouter(ROUTER).approvePlugin(_plugin);
    }

    function createIncreasePosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice,
        uint256 _executionFee,
        bytes32 _referralCode,
        address _callbackTarget
    ) external payable onlyRole(USER_ROLE) returns (bytes32) {
        return IPositionRouter(POSITION_ROUTER).createIncreasePosition(_path, _indexToken, _amountIn, _minOut, _sizeDelta, _isLong, _acceptablePrice, _executionFee, _referralCode, _callbackTarget);
    }

    function createIncreasePositionETH(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice,
        uint256 _executionFee,
        bytes32 _referralCode,
        address _callbackTarget
    ) external payable onlyRole(USER_ROLE) returns (bytes32) {
        return IPositionRouter(POSITION_ROUTER).createIncreasePositionETH{value: msg.value}(_path, _indexToken, _minOut, _sizeDelta, _isLong, _acceptablePrice, _executionFee, _referralCode, _callbackTarget);
    }
    
    function createDecreasePosition(
        address[] memory _path,
        address _indexToken,
        uint256 _collateralDelta,
        uint256 _sizeDelta,
        bool _isLong,
        address _receiver,
        uint256 _acceptablePrice,
        uint256 _minOut,
        uint256 _executionFee,
        bool _withdrawETH,
        address _callbackTarget
    ) external payable onlyRole(USER_ROLE) returns (bytes32) {
        return IPositionRouter(POSITION_ROUTER).createDecreasePosition(_path, _indexToken, _collateralDelta, _sizeDelta, _isLong, _receiver, _acceptablePrice, _minOut, _executionFee, _withdrawETH, _callbackTarget);
    }
    
    function withdrawToken(address token, address to, uint256 amount) external onlyRole(USER_ROLE) returns (bool) {
        return IERC20(token).transfer(to, amount);
    }

    function withdrawEth(address to, uint256 amount) external onlyRole(USER_ROLE) returns (bool) {
        (bool success,) = to.call{ value: amount}("");
        require(success, "Transfer failed!");
        return success;
    }
}