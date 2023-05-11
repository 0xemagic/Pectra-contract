// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
import "../GMX/interfaces/IGMXAdapter.sol";

contract GMXAdapter {

    address public FACTORY;
    address public OWNER;
    address public ROUTER;
    address public POSITION_ROUTER;
    address constant ZERO_ADDRESS = address(0);
    bytes32 constant ZERO_VALUE = 0x0000000000000000000000000000000000000000000000000000000000000000;
    
    address[] public path;
    address public indexToken;
    uint256 public amountIn;
    uint256 public minOut;
    uint256 public sizeDelta;
    bool public isLong;
    uint256 public acceptablePrice;
        
    modifier onlyOwner() {
        require(OWNER == msg.sender || FACTORY == msg.sender, "caller is not the owner or factory");
        _;
    }
    
    receive() external payable {}
    
    constructor() {
        FACTORY = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _router, address _positionRouter, address _owner) external {
        require(msg.sender == FACTORY, 'GMXAdapter: FORBIDDEN'); // sufficient check
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;
        OWNER = _owner;

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
        bytes32 result = IPositionRouter(POSITION_ROUTER).createIncreasePosition{value: msg.value}(_path, _indexToken, _amountIn, _minOut, _sizeDelta, _isLong, _acceptablePrice, _executionFee, ZERO_VALUE, ZERO_ADDRESS);
        setPositionData(_path, _indexToken, _amountIn, _minOut, _sizeDelta, _isLong, _acceptablePrice);
        return result;
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
        bytes32 result = IPositionRouter(POSITION_ROUTER).createIncreasePositionETH{value: msg.value}(_path, _indexToken, _minOut, _sizeDelta, _isLong, _acceptablePrice, _executionFee, ZERO_VALUE, ZERO_ADDRESS);
        setPositionData(_path, _indexToken, msg.value - _executionFee, _minOut, _sizeDelta, _isLong, _acceptablePrice);
        return result;

    }
    
    function closePosition(address receiver, uint256 _acceptablePrice) external payable returns (bytes32) {
        uint256 _executionFee = IPositionRouter(POSITION_ROUTER).minExecutionFee();
        bytes32 result = IPositionRouter(POSITION_ROUTER).createDecreasePosition{value: msg.value}(path, indexToken, 0, sizeDelta, isLong, receiver, _acceptablePrice, 0, _executionFee, false, ZERO_ADDRESS);
        return result;
    }
    
    function withdrawToken(address token, address to, uint256 amount) external onlyOwner returns (bool) {
        return IERC20(token).transfer(to, amount);
    }

    function withdrawEth(address to, uint256 amount) external onlyOwner returns (bool) {
        (bool success,) = to.call{ value: amount}("");
        require(success, "Transfer failed!");
        return success;
    }

    function setPositionData (address[] memory _path, address _indexToken, uint256 _amountIn, uint256 _minOut, uint256 _sizeDelta, bool _isLong, uint256 _acceptablePrice) internal {
        path = _path;
        indexToken = _indexToken;
        amountIn = _amountIn;
        minOut = _minOut;
        sizeDelta = _sizeDelta;
        isLong = _isLong;
        acceptablePrice = _acceptablePrice;
    }
}