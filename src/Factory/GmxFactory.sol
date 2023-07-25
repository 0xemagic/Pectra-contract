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
    address public READER;
    address public VAULT;

    // Mapping to store the GMXAdapter contract addresses associated with each position ID.
    mapping (bytes32 => address) public positionAdapters;

    // Mapping to store the owners of each position ID.
    mapping (bytes32 => address) public positionOwners;

    // Mapping to store the number of positions owned by each address.
    mapping (address => uint256) public positions;

    // Mapping to store the position IDs associated with each address and their index.
    mapping (address => mapping (uint => bytes32)) public indexedPositions;

    // Events
    event TokensWithdrawn(address token, address to, uint amount);
    event EthWithdrawn(address to, uint amount);

    /**
     * @dev Constructor to initialize the GMXFactory contract.
     *
     * @param _router The address of the GMX router contract.
     * @param _positionRouter The address of the GMX position router contract.
     * @param _reader The address of the GMX reader contract.
     * @param _vault The address of the GMX vault contract.
     */
    constructor(address _router, address _positionRouter, address _reader, address _vault) {
        OWNER = msg.sender;
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;
        READER = _reader;
        VAULT = _vault;
    }

    // Modifier to restrict access to only the contract owner.
    modifier onlyOwner() {
        require(OWNER == msg.sender, "caller is not the owner");
        _;
    }

    /**
     * @dev Withdraw tokens from the contract.
     *
     * @param _token The address of the token to withdraw.
     * @param _to The address to which tokens will be transferred.
     * @param _amount The amount of tokens to withdraw.
     * @return success Whether the token transfer was successful or not.
     */
    function withdrawToken(address _token, address _to, uint256 _amount) external onlyOwner returns (bool success) {
        success = IERC20(_token).transfer(_to, _amount);
        if (success) {
            emit TokensWithdrawn(_token, _to, _amount);
        }
    }

    /**
     * @dev Withdraw ETH from the contract.
     *
     * @param _to The address to which ETH will be transferred.
     * @param _amount The amount of ETH to withdraw.
     * @return success Whether the ETH transfer was successful or not.
     */
    function withdrawEth(address _to, uint256 _amount) external onlyOwner returns (bool success) {
        (success,) = _to.call{ value: _amount}("");
        require(success, "Transfer failed!");
        emit EthWithdrawn(_to, _amount);
    }

    /**
     * @dev Open a long position using tokens as collateral.
     *
     * @param _path The token path for the long position.
     * @param _indexToken The index token for the long position.
     * @param _amountIn The amount of tokens to invest.
     * @param _minOut The minimum acceptable amount of output tokens.
     * @param _sizeDelta The amount of leverage taken from the Exchange for the long position.
     * @param _acceptablePrice The acceptable price for the long position.
     * @return positionId The ID of the newly created long position.
     */
    function openLongPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32 positionId) {
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
        positionId = IGMXAdapter(adapter).createIncreasePosition{value: msg.value}(
            _path,
            _indexToken,
            _amountIn,
            _minOut,
            _sizeDelta,
            true,
            _acceptablePrice
        );
        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
    }

    /**
     * @dev Open a long position using ETH as collateral.
     *
     * @param _path The token path for the long position.
     * @param _indexToken The index token for the long position.
     * @param _minOut The minimum acceptable amount of output tokens.
     * @param _sizeDelta The amount of leverage taken from the Exchange for the long position.
     * @param _acceptablePrice The acceptable price for the long position.
     * @return positionId The ID of the newly created long position.
     */
    function openLongPositionEth(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32 positionId) {
        bytes memory bytecode = type(GMXAdapter).creationCode;
        address adapter;
        assembly {
            adapter := create(0, add(bytecode, 32), mload(bytecode))
        }
        IGMXAdapter(adapter).initialize(ROUTER, POSITION_ROUTER, msg.sender);
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
        positionId = IGMXAdapter(adapter).createIncreasePositionETH{value: msg.value}(
            _path,
            _indexToken,
            _minOut,
            _sizeDelta,
            true,
            _acceptablePrice
        );
        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
    }

    /**
     * @dev Open a short position using tokens as collateral.
     *
     * @param _path The token path for the short position.
     * @param _indexToken The index token for the short position.
     * @param _amountIn The amount of tokens to invest.
     * @param _minOut The minimum acceptable amount of output tokens.
     * @param _sizeDelta The amount of leverage taken from the Exchange for the short position.
     * @param _acceptablePrice The acceptable price for the short position.
     * @return positionId The ID of the newly created short position.
     */
    function openShortPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta, 
        uint256 _acceptablePrice
    ) external payable returns (bytes32 positionId) {
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
        positionId = IGMXAdapter(adapter).createIncreasePosition{value: msg.value}(
            _path,
            _indexToken,
            _amountIn,
            _minOut,
            _sizeDelta,
            false,
            _acceptablePrice
        );
        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
    }

    /**
     * @dev Open a short position using ETH as collateral.
     *
     * @param _path The token path for the short position.
     * @param _indexToken The index token for the short position.
     * @param _minOut The minimum acceptable amount of output tokens.
     * @param _sizeDelta The amount of leverage taken from the Exchange for the short position.
     * @param _acceptablePrice The acceptable price for the short position.
     * @return positionId The ID of the newly created short position.
     */
    function openShortPositionEth(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32 positionId) {
        bytes memory bytecode = type(GMXAdapter).creationCode;
        address adapter;
        assembly {
            adapter := create(0, add(bytecode, 32), mload(bytecode))
        }
        IGMXAdapter(adapter).initialize(ROUTER, POSITION_ROUTER, msg.sender);
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
        positionId = IGMXAdapter(adapter).createIncreasePositionETH{value: msg.value}(
            _path,
            _indexToken,
            _minOut,
            _sizeDelta,
            false,
            _acceptablePrice
        );
        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
    }

    /**
     * @dev Close a position and withdraw funds.
     *
     * @param _positionId The ID of the position to be closed.
     * @param _path The token path for the position to be closed.
     * @param _acceptablePrice The acceptable price for closing the position.
     * @param _withdrawETH Whether to withdraw ETH after closing the position.
     */
    function closePosition(
        bytes32 _positionId,
        address[] memory _path,
        uint256 _acceptablePrice,
        bool _withdrawETH
    ) external payable {
        require(msg.sender == positionOwners[_positionId], "not a position owner");
        uint256[] memory data = getPosition(_positionId);
        address adapter = positionAdapters[_positionId];
        if (data[0] != 0){
            IGMXAdapter(adapter).closePosition{value: msg.value}(_path, msg.sender, _acceptablePrice, _withdrawETH);
        }
        else {
            IGMXAdapter(adapter).closeFailedPosition(_path, msg.sender);
        }
    }

    /**
     * @dev Get the position details associated with a given position ID.
     *
     * @param _positionId The ID of the position to query.
     * @return An array containing the all the details associated with the position ID.
     */
    function getPosition(bytes32 _positionId) public view returns(uint256[] memory) {
        address account = positionAdapters[_positionId];
        (, address collateralToken, address indexToken, , , , bool isLong,) = IGMXAdapter(account).getPositionData(); 
        address[] memory collateralTokens = new address[](1);
        collateralTokens[0] = collateralToken;
        address[] memory indexTokens = new address[](1);
        indexTokens[0] = indexToken;
        bool[] memory isLongs = new bool[](1);
        isLongs[0] = isLong;
        return IReader(READER).getPositions(VAULT, account, collateralTokens, indexTokens, isLongs);
    }
}