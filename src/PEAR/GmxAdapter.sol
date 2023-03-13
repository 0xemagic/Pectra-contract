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
    
    receive() external payable {}

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
    ) external payable returns (bytes32) {
        return IPositionRouter(POSITION_ROUTER).createIncreasePositionETH(_path, _indexToken, _minOut, _sizeDelta, _isLong, _acceptablePrice, _executionFee, _referralCode, _callbackTarget);
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
    ) external payable returns (bytes32) {
        return IPositionRouter(POSITION_ROUTER).createDecreasePosition(_path, _indexToken, _collateralDelta, _sizeDelta, _isLong, _receiver, _acceptablePrice, _minOut, _executionFee, _withdrawETH, _callbackTarget);
    }
    
    function cancelIncreasePosition(bytes32 _key, address payable _executionFeeReceiver) external onlyOwner returns (bool) {
        return IPositionRouter(POSITION_ROUTER).cancelIncreasePosition(_key, _executionFeeReceiver);
    }

    function cancelDecreasePosition(bytes32 _key, address payable _executionFeeReceiver) external returns (bool) {
        return IPositionRouter(POSITION_ROUTER).cancelDecreasePosition(_key, _executionFeeReceiver);
    }
    
    function executeDecreasePosition(bytes32 _key, address payable _executionFeeReceiver) external returns (bool) {
        return IPositionRouter(POSITION_ROUTER).executeDecreasePosition(_key, _executionFeeReceiver);
    }

    function executeIncreasePosition(bytes32 _key, address payable _executionFeeReceiver) external onlyOwner returns (bool) {
        return IPositionRouter(POSITION_ROUTER).executeIncreasePosition(_key, _executionFeeReceiver);
    }

    function swap(address[] memory _path, uint256 _amountIn, uint256 _minOut, address _receiver) external onlyOwner {
        IRouter(ROUTER).swap(_path, _amountIn, _minOut, _receiver);
    }
    
    function swapETHToTokens(address[] memory _path, uint256 _minOut, address _receiver) external payable onlyOwner {
        IRouter(ROUTER).swapETHToTokens{value: msg.value}(_path, _minOut, _receiver);
    }
    
    function swapTokensToETH(address[] memory _path, uint256 _amountIn, uint256 _minOut, address payable _receiver) external onlyOwner {
        IRouter(ROUTER).swapTokensToETH(_path, _amountIn, _minOut, _receiver);
    }

    function withdrawToken(address token, address to, uint256 amount) external onlyOwner returns (bool) {
        return IERC20(token).transfer(to, amount);
    }

    function withdrawEth(address to, uint256 amount) external onlyOwner returns (bool) {
        (bool success,) = to.call{ value: amount}("");
        require(success, "Transfer failed!");
        return success;
    }
}