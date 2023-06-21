// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
import "../GMX/interfaces/IRouter.sol";
import "../GMX/interfaces/IReader.sol";
import "../GMX/interfaces/IGMXAdapter.sol";
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
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
        address collateral = _path[0];
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
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
        address collateral = _path[0];
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

    function closePosition(bytes32 positionId, address[] memory _path, uint256 _acceptablePrice, bool _withdrawETH) external payable {
        require(msg.sender == positionOwners[positionId], "not a position owner");
        address adapter = positionAdapters[positionId];
        IGMXAdapter(adapter).closePosition{value: msg.value}(_path, msg.sender, _acceptablePrice, _withdrawETH);
    }

    function getPosition(bytes32 positionId, address reader, address vault) external view returns(uint256[] memory) {
        address account = positionAdapters[positionId];
        (, address collateralToken, address indexToken, , , , bool isLong,) = IGMXAdapter(account).getPositionData(); 
        address[] memory collateralTokens = new address[](1);
        collateralTokens[0] = collateralToken;
        address[] memory indexTokens = new address[](1);
        indexTokens[0] = indexToken;
        bool[] memory isLongs = new bool[](1);
        isLongs[0] = isLong;
        return IReader(reader).getPositions(vault, account, collateralTokens, indexTokens, isLongs);
    }
}