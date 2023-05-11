// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
import "../GMX/interfaces/IRouter.sol";
import "../Adapters/GMXAdapter.sol";

contract GMXFactory {
    
    address public OWNER;
    address public ROUTER;
    address public POSITION_ROUTER;

    mapping (bytes32 => address) public positionAdapters;

    mapping (bytes32 => address) public positionOwners;

    mapping (address => uint256) public positions;

    mapping (address => mapping (uint => bytes32)) public indexedPositions;

    constructor(address _router, address _positionRouter) {
        OWNER = msg.sender;
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;
    }

    modifier onlyOwner() {
        require(OWNER == msg.sender, "caller is not the owner");
        _;
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

    function openLongPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32) {
        bytes memory bytecode = type(GMXAdapter).creationCode;
        address adapter;
        assembly {
            adapter := create(0, add(bytecode, 32), mload(bytecode))
        }
        IGMXAdapter(adapter).initialize(ROUTER, POSITION_ROUTER, msg.sender);
        address collateral = _path[_path.length-1];
        IERC20(collateral).transferFrom(msg.sender, adapter, _amountIn);
        IGMXAdapter(adapter).approve(collateral, ROUTER, _amountIn);
        bytes32 positionId = IGMXAdapter(adapter).createIncreasePosition{value: msg.value}(_path, _indexToken, _amountIn, _minOut, _sizeDelta, true, _acceptablePrice);
        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
        return positionId;
    }

    function openLongPositionEth(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32) {
        bytes memory bytecode = type(GMXAdapter).creationCode;
        address adapter;
        assembly {
            adapter := create(0, add(bytecode, 32), mload(bytecode))
        }
        IGMXAdapter(adapter).initialize(ROUTER, POSITION_ROUTER, msg.sender);
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
        bytes32 positionId = IGMXAdapter(adapter).createIncreasePositionETH{value: msg.value}(_path, _indexToken, _minOut, _sizeDelta, true, _acceptablePrice);
        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
        return positionId;
    }

    function openShortPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32) {
        bytes memory bytecode = type(GMXAdapter).creationCode;
        address adapter;
        assembly {
            adapter := create(0, add(bytecode, 32), mload(bytecode))
        }
        IGMXAdapter(adapter).initialize(ROUTER, POSITION_ROUTER, msg.sender);
        address collateral = _path[_path.length-1];
        IERC20(collateral).transferFrom(msg.sender, adapter, _amountIn);
        IGMXAdapter(adapter).approve(collateral, ROUTER, _amountIn);
        bytes32 positionId = IGMXAdapter(adapter).createIncreasePosition{value: msg.value}(_path, _indexToken, _amountIn, _minOut, _sizeDelta, false, _acceptablePrice);
        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
        return positionId;
    }

    function openShortPositionEth(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32) {
        bytes memory bytecode = type(GMXAdapter).creationCode;
        address adapter;
        assembly {
            adapter := create(0, add(bytecode, 32), mload(bytecode))
        }
        IGMXAdapter(adapter).initialize(ROUTER, POSITION_ROUTER, msg.sender);
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
        bytes32 positionId = IGMXAdapter(adapter).createIncreasePositionETH{value: msg.value}(_path, _indexToken, _minOut, _sizeDelta, false, _acceptablePrice);
        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
        return positionId;
    }

    function closePosition(bytes32 positionId, uint256 _acceptablePrice) external {
        require(msg.sender == positionOwners[positionId]);
        address adapter = positionAdapters[positionId];
        IGMXAdapter(adapter).closePosition(msg.sender, _acceptablePrice);
    }

}