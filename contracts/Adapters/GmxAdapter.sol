// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
//import "../GMX/interfaces/IRouter.sol";
//import "../GMX/interfaces/IPositionRouter.sol";
import "../GMX/interfaces/IGMXAdapter.sol";

contract GMXAdapter {

    address public FACTORY;
    address public OWNER;
    address public ROUTER;
    address public POSITION_ROUTER;
    address constant ZERO_ADDRESS = address(0);
    bytes32 constant ZERO_VALUE = 0x0000000000000000000000000000000000000000000000000000000000000000;
    
    modifier onlyOwner() {
        require(OWNER == msg.sender, "caller is not the owner");
        _;
    }
    
    receive() external payable {}
    
    constructor() {
        OWNER = msg.sender;
        FACTORY = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _router, address _positionRouter) external {
        require(msg.sender == FACTORY, 'GMXAdapter: FORBIDDEN'); // sufficient check
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;

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
        uint256 _acceptablePrice
    ) external payable onlyOwner returns (bytes32) {
        uint256 _executionFee = IPositionRouter(POSITION_ROUTER).minExecutionFee();
        return IPositionRouter(POSITION_ROUTER).createIncreasePosition(_path, _indexToken, _amountIn, _minOut, _sizeDelta, _isLong, _acceptablePrice, _executionFee, ZERO_VALUE, ZERO_ADDRESS);
    }

    function createIncreasePositionETH(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice
    ) external payable returns (bytes32) {
        uint256 _executionFee = IPositionRouter(POSITION_ROUTER).minExecutionFee();
        return IPositionRouter(POSITION_ROUTER).createIncreasePositionETH{value: msg.value}(_path, _indexToken, _minOut, _sizeDelta, _isLong, _acceptablePrice, _executionFee, ZERO_VALUE, ZERO_ADDRESS);
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
    
    function withdrawToken(address token, address to, uint256 amount) external onlyOwner returns (bool) {
        return IERC20(token).transfer(to, amount);
    }

    function withdrawEth(address to, uint256 amount) external onlyOwner returns (bool) {
        (bool success,) = to.call{ value: amount}("");
        require(success, "Transfer failed!");
        return success;
    }
}