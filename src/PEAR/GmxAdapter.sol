// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
import "../GMX/interfaces/IRouter.sol";
import "../GMX/interfaces/IPositionRouter.sol";

contract GMXAdapter {

    address public OWNER;
    address public ROUTER;
    address public POSITION_ROUTER;
    
    constructor(address _router, address _positionRouter) {
        OWNER = msg.sender;
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;
    }

    modifier onlyOwner() {
        require(OWNER == msg.sender, "caller is not the owner");
        _;
    }

    function approve(address token, address spender, uint256 amount) external onlyOwner returns (bool) {
        return IERC20(token).approve(spender, amount);
    }

    function approvePlugin(address _plugin) external onlyOwner {
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
    ) external payable onlyOwner returns (bytes32) {
        return IPositionRouter(POSITION_ROUTER).createIncreasePosition(_path, _indexToken, _amountIn, _minOut, _sizeDelta, _isLong, _acceptablePrice, _executionFee, _referralCode, _callbackTarget);
    }

    function cancelIncreasePosition(bytes32 _key, address payable _executionFeeReceiver) external onlyOwner returns (bool) {
        return IPositionRouter(POSITION_ROUTER).cancelIncreasePosition(_key, _executionFeeReceiver);
    }

    function executeIncreasePosition(bytes32 _key, address payable _executionFeeReceiver) external onlyOwner returns (bool) {
        return IPositionRouter(POSITION_ROUTER).executeIncreasePosition(_key, _executionFeeReceiver);
    }

    function withdrawToken(address token, address to, uint256 amount) external onlyOwner returns (bool) {
        return IERC20(token).transfer(to, amount);
    }
}