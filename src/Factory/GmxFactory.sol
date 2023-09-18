// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../GMX/interfaces/IRouter.sol";
import "../GMX/interfaces/IReader.sol";
import "../GMX/interfaces/IGMXAdapter.sol";
import "../Adapters/GMXAdapter.sol";
import "../PlatformLogic/IPlatformLogic.sol";

error NotPlatformLogic();
error TransactionFailedOnTokenTransfer();
error TokenNotAllowed();

contract GMXFactory {
    address public OWNER;
    address public ROUTER;
    address public POSITION_ROUTER;
    address public READER;
    address public VAULT;
    address public NFT_HANDLER;
    IPlatformLogic public PLATFORM_LOGIC;

    uint256 public totalTradePairs;

    enum PositionStatus {
        Opened,
        Closed,
        Transferred
    }

    // Mapping to store the GMXAdapter contract addresses associated with each position ID.
    mapping(bytes32 => address) public positionAdapters;

    // Mapping to store the owners of each position ID.
    mapping(bytes32 => address) public positionOwners;

    // Mapping to store the number of positions owned by each address.
    mapping(address => uint256) public positions;

    // Mapping to store the position IDs associated with each address and their index.
    mapping(address => mapping(uint256 => bytes32)) public indexedPositions;

    //Mapping to store the status of the PositonId
    mapping(bytes32 => mapping(address => PositionStatus))
        public positionDetails;

    /// @notice Mapping to store the allowed tokens
    /// @dev Can be used to stop exploits with a curcuit brake
    /// @dev add a way to add to the mapping
    /// @dev should store the allowed tokens for payment of the fee?
    mapping(IERC20 => bool) public allowedTokens;

    // Events
    event TokensWithdrawn(
        address indexed token,
        address indexed to,
        uint256 indexed amount
    );
    event EthWithdrawn(address indexed to, uint256 indexed amount);
    event LongPositionOpened(
        bytes32 indexed positionId,
        address indexed owner,
        address indexed adapter
    );
    event ShortPositionOpened(
        bytes32 indexed positionId,
        address indexed owner,
        address indexed adapter
    );
    event LongETHPositionOpened(
        bytes32 indexed positionId,
        address indexed owner,
        address indexed adapter
    );
    event ShortETHPositionOpened(
        bytes32 indexed positionId,
        address indexed owner,
        address indexed adapter
    );
    event PositionClosed(
        bytes32 indexed positionId,
        address indexed owner,
        address indexed adapter,
        bool isLong
    );

    event CreateIncreasePosition(
        bytes32 indexed positionId,
        address indexed owner,
        address indexed adapter,
        uint256 amountIn
    );
    event CreateDecreasePosition(
        bytes32 indexed positionId,
        address indexed owner,
        address indexed adapter,
        uint256 amountIn
    );

    event PlatformLogicsFactoryChanged(
        address indexed factory,
        bool indexed newState
    );

    event PlatformLogicChanged(
        IPlatformLogic oldAddress,
        IPlatformLogic newAddress
    );

    event AllowedTokenSet(IERC20 token, bool allowed);

    struct nftData {
        address[] _pathLong;
        address[] _pathShort;
        address _indexTokenLong;
        address _indexTokenShort;
        uint256 _amountIn;
        uint256 _minOut;
        uint256 _sizeDeltaLong;
        uint256 _sizeDeltaShort;
        uint256 _acceptablePriceLong;
        uint256 _acceptablePriceShort;
    }

    /**
     * @dev Constructor to initialize the GMXFactory contract.
     *
     * @param _router The address of the GMX router contract.
     * @param _positionRouter The address of the GMX position router contract.
     * @param _reader The address of the GMX reader contract.
     * @param _vault The address of the GMX vault contract.
     * @param _platformLogic the address of the platformlogic contract, which handles the fees
     */
    constructor(
        address _router,
        address _positionRouter,
        address _reader,
        address _vault,
        IPlatformLogic _platformLogic,
        IERC20 _tokenFeePaymentAddress
    ) {
        OWNER = msg.sender;
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;
        READER = _reader;
        VAULT = _vault;
        PLATFORM_LOGIC = _platformLogic;
        allowedTokens[_tokenFeePaymentAddress] = true;
        emit AllowedTokenSet(_tokenFeePaymentAddress, true);
    }

    function setAllowedToken(
        IERC20 _tokenFeePaymentAddress,
        bool _allowed
    ) external onlyOwner {
        allowedTokens[_tokenFeePaymentAddress] = _allowed;
        emit AllowedTokenSet(_tokenFeePaymentAddress, _allowed);
    }

    // Modifier to restrict access to only the contract owner.
    modifier onlyOwner() {
        require(OWNER == msg.sender, "GMX FACTORY: caller is not the owner");
        _;
    }

    // Modifier to restrict access to only the contract owner.
    modifier onlyNftHandler() {
        require(
            NFT_HANDLER == msg.sender,
            "GMX FACTORY: Caller is not NFT Handler"
        );
        _;
    }

    // Modifier to restrict access to only the gmx adaoter contract.
    modifier onlyAdapter() {
        require(
            NFT_HANDLER == msg.sender,
            "GMX FACTORY: Caller is not NFT Handler"
        );
        _;
    }

    modifier onlyAllowedTokens(IERC20 _token) {
        if (allowedTokens[_token] != true) revert TokenNotAllowed();
        _;
    }

    modifier onlyPlatformLogic() {
        if (msg.sender != address(PLATFORM_LOGIC)) revert NotPlatformLogic();
        _;
    }

    /**
     * @dev Setter function for NFT Handler contract.
     *
     * @param _nftHandler The address of the nft Handler contract.
     */
    function setNftHandler(address _nftHandler) public onlyOwner {
        NFT_HANDLER = _nftHandler;
    }

    /**
     * @dev Withdraw tokens from the contract.
     *
     * @param _token The address of the token to withdraw.
     * @param _to The address to which tokens will be transferred.
     * @param _amount The amount of tokens to withdraw.
     * @return success Whether the token transfer was successful or not.
     */
    function withdrawToken(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyOwner returns (bool success) {
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
    function withdrawEth(
        address _to,
        uint256 _amount
    ) external onlyOwner returns (bool success) {
        (success, ) = _to.call{value: _amount}("");
        require(success, "GMX FACTORY: Transfer failed!");
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
    )
        external
        payable
        onlyAllowedTokens(IERC20(_path[0]))
        returns (bytes32 positionId)
    {
        bytes memory bytecode = type(GMXAdapter).creationCode;
        address adapter;
        assembly {
            adapter := create(0, add(bytecode, 32), mload(bytecode))
        }
        IGMXAdapter(adapter).initialize(
            ROUTER,
            POSITION_ROUTER,
            msg.sender,
            NFT_HANDLER
        );
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
        address collateral = _path[0];
        /// @dev apply platform fees
        // _amount is the gross amount left after fees
        uint256 _amount = PLATFORM_LOGIC.applyPlatformFeeErc20(
            msg.sender,
            _amountIn,
            IERC20(collateral),
            address(this)
        );

        IERC20(collateral).transferFrom(msg.sender, adapter, _amount);

        IGMXAdapter(adapter).approve(collateral, ROUTER, _amount);

        positionId = IGMXAdapter(adapter).createIncreasePosition{
            value: msg.value
        }(
            _path,
            _indexToken,
            _amount,
            _minOut,
            _sizeDelta,
            true,
            _acceptablePrice
        );

        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
        positionDetails[positionId][msg.sender] = PositionStatus.Opened;
        totalTradePairs++;

        // Emit the LongPositionOpened event.
        emit LongPositionOpened(positionId, msg.sender, adapter);
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
        IGMXAdapter(adapter).initialize(
            ROUTER,
            POSITION_ROUTER,
            msg.sender,
            NFT_HANDLER
        );
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);

        /// @dev the amount sent is also calculated in the external call to applyPlatformFeeEth function
        // calculates the platformFees and sends the _value as msg.value
        uint256 _value = PLATFORM_LOGIC.calculateFees(
            msg.value,
            PLATFORM_LOGIC.viewPlatformFee()
        );

        /// @dev apply platform fees with eth
        /// @notice _amount = the amount left after the apply of platformFees
        uint256 _amount = PLATFORM_LOGIC.applyPlatformFeeEth{value: _value}(
            msg.sender,
            msg.value
        );

        positionId = IGMXAdapter(adapter).createIncreasePositionETH{
            value: _amount
        }(_path, _indexToken, _minOut, _sizeDelta, true, _acceptablePrice);

        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
        positionDetails[positionId][msg.sender] = PositionStatus.Opened;
        totalTradePairs++;

        // Emit the LongETHPositionOpened event.
        emit LongETHPositionOpened(positionId, msg.sender, adapter);
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
    )
        public
        payable
        onlyAllowedTokens(IERC20(_path[0]))
        returns (bytes32 positionId)
    {
        bytes memory bytecode = type(GMXAdapter).creationCode;
        address adapter;
        assembly {
            adapter := create(0, add(bytecode, 32), mload(bytecode))
        }
        IGMXAdapter(adapter).initialize(
            ROUTER,
            POSITION_ROUTER,
            msg.sender,
            NFT_HANDLER
        );
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
        address collateral = _path[0];
        /// @dev apply platform fees
        // _amount is the gross amount left after fees
        uint256 _amount = PLATFORM_LOGIC.applyPlatformFeeErc20(
            msg.sender,
            _amountIn,
            IERC20(collateral),
            address(this)
        );

        IERC20(collateral).transferFrom(msg.sender, adapter, _amount);
        IGMXAdapter(adapter).approve(collateral, ROUTER, _amount);

        positionId = IGMXAdapter(adapter).createIncreasePosition{
            value: msg.value
        }(
            _path,
            _indexToken,
            _amount,
            _minOut,
            _sizeDelta,
            false,
            _acceptablePrice
        );

        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
        positionDetails[positionId][msg.sender] = PositionStatus.Opened;
        totalTradePairs++;

        // Emit the ShortPositionOpened event.
        emit ShortPositionOpened(positionId, msg.sender, adapter);
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
        IGMXAdapter(adapter).initialize(
            ROUTER,
            POSITION_ROUTER,
            msg.sender,
            NFT_HANDLER
        );
        IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
        /// @dev the amount sent is also calculated in the external call to applyPlatformFeeEth function
        // calculates the platformFees and sends the _value as msg.value
        uint256 _value = PLATFORM_LOGIC.calculateFees(
            msg.value,
            PLATFORM_LOGIC.viewPlatformFee()
        );

        /// @dev apply platform fees with eth
        /// @notice _amount = the amount left after the apply of platformFees
        // passes in gross amount for calculations on the platformLogic's side
        uint256 _amount = PLATFORM_LOGIC.applyPlatformFeeEth{value: _value}(
            msg.sender,
            msg.value
        );

        positionId = IGMXAdapter(adapter).createIncreasePositionETH{
            value: _amount
        }(_path, _indexToken, _minOut, _sizeDelta, false, _acceptablePrice);

        positionAdapters[positionId] = adapter;
        positionOwners[positionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = positionId;
        positionDetails[positionId][msg.sender] = PositionStatus.Opened;
        totalTradePairs++;

        // Emit the ShortETHPositionOpened event.
        emit ShortPositionOpened(positionId, msg.sender, adapter);
    }

    /**
     * @dev Create a position using tokens as collateral.
     *
     * @param _positionId The id of the position
     * @param _path The token path for the position.
     * @param _indexToken The index token for the position.
     * @param _amountIn The amount of tokens to invest.
     * @param _minOut The minimum acceptable amount of output tokens.
     * @param _sizeDelta The amount of leverage taken from the Exchange for the position.
     * @param _isLong Whether the position is a position (true) or a short position (false).
     * @param _acceptablePrice The acceptable price for the position.
     * @return positionId The ID of the newly created position.
     */
    function createIncreasePosition(
        bytes32 _positionId,
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice
    ) external payable returns (bytes32 positionId) {
        require(
            msg.sender == positionOwners[_positionId],
            "GMX FACTORY: Not a position owner"
        );
        require(
            positionDetails[_positionId][msg.sender] == PositionStatus.Opened,
            "GMX FACTORY: Position not open"
        );
        address adapter = positionAdapters[_positionId];
        address collateral = _path[0];
        IERC20(collateral).transferFrom(msg.sender, adapter, _amountIn);
        IGMXAdapter(adapter).approve(collateral, ROUTER, _amountIn);
        positionId = IGMXAdapter(adapter).createIncreasePosition{
            value: msg.value
        }(
            _path,
            _indexToken,
            _amountIn,
            _minOut,
            _sizeDelta,
            _isLong,
            _acceptablePrice
        );

        emit CreateIncreasePosition(positionId, msg.sender, adapter, _amountIn);
    }

    /**
     * @dev Decrease a position using tokens as collateral.
     *
     * @param _positionId The id of the position
     * @param _path The token path for the position.
     * @param _amountIn The amount of tokens to invest.
     * @param _acceptablePrice The acceptable price for the position.
     * @param _withdrawETH Whether to withdraw ETH after closing the position.
     * @return positionId The ID of the newly created position.
     */
    function createDecreasePosition(
        bytes32 _positionId,
        address[] memory _path,
        uint256 _amountIn,
        uint256 _acceptablePrice,
        bool _withdrawETH
    ) external payable returns (bytes32 positionId) {
        require(
            msg.sender == positionOwners[_positionId],
            "GMX FACTORY: Not a position owner"
        );
        require(
            positionDetails[_positionId][msg.sender] == PositionStatus.Opened,
            "GMX FACTORY: Position not open"
        );
        address adapter = positionAdapters[_positionId];
        positionId = IGMXAdapter(adapter).createDecreasePosition{
            value: msg.value
        }(_path, _amountIn, msg.sender, _withdrawETH, _acceptablePrice);

        emit CreateDecreasePosition(positionId, msg.sender, adapter, _amountIn);
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
        require(
            msg.sender == positionOwners[_positionId],
            "GMX FACTORY: Not a position owner"
        );
        uint256[] memory data = getPosition(_positionId);
        address adapter = positionAdapters[_positionId];
        if (data[0] != 0) {
            IGMXAdapter(adapter).closePosition{value: msg.value}(
                _path,
                msg.sender,
                _acceptablePrice,
                _withdrawETH
            );
        } else {
            IGMXAdapter(adapter).closeFailedPosition(_path, msg.sender);
        }

        (, , , , , , bool isLong, ) = IGMXAdapter(adapter).getPositionData();

        positionDetails[_positionId][msg.sender] = PositionStatus.Closed;

        // Emit the PositionClosed event.
        emit PositionClosed(_positionId, msg.sender, adapter, isLong);
    }

    /**
     * @dev Get the position details associated with a given position ID.
     *
     * @param _positionId The ID of the position to query.
     * @return An array containing the all the details associated with the position ID.
     */
    function getPosition(
        bytes32 _positionId
    ) public view returns (uint256[] memory) {
        address account = positionAdapters[_positionId];
        (
            ,
            address collateralToken,
            address indexToken,
            ,
            ,
            ,
            bool isLong,

        ) = IGMXAdapter(account).getPositionData();
        address[] memory collateralTokens = new address[](1);
        collateralTokens[0] = collateralToken;
        address[] memory indexTokens = new address[](1);
        indexTokens[0] = indexToken;
        bool[] memory isLongs = new bool[](1);
        isLongs[0] = isLong;
        return
            IReader(READER).getPositions(
                VAULT,
                account,
                collateralTokens,
                indexTokens,
                isLongs
            );
    }

    /**
     * @dev Create an NFT representing a pair of long and short positions.
     *
     * @param _nftData The token data for the position.
     */
    function openPositions(
        nftData memory _nftData
    ) external payable returns (bytes32, bytes32) {
        bytes32 longPositionId;
        bytes32 shortPositionId;

        {
            // Call the original `openLongPosition` function
            bytes memory bytecode = type(GMXAdapter).creationCode;
            address adapter;
            assembly {
                adapter := create(0, add(bytecode, 32), mload(bytecode))
            }
            IGMXAdapter(adapter).initialize(
                ROUTER,
                POSITION_ROUTER,
                msg.sender,
                NFT_HANDLER
            );
            IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
            address collateral = _nftData._pathLong[0];
            IERC20(collateral).transferFrom(
                msg.sender,
                adapter,
                _nftData._amountIn
            );
            IGMXAdapter(adapter).approve(
                collateral,
                ROUTER,
                _nftData._amountIn
            );
            longPositionId = IGMXAdapter(adapter).createIncreasePosition{
                value: msg.value / 2
            }(
                _nftData._pathLong,
                _nftData._indexTokenLong,
                _nftData._amountIn,
                _nftData._minOut,
                _nftData._sizeDeltaLong,
                true,
                _nftData._acceptablePriceLong
            );
            positionAdapters[longPositionId] = adapter;
            positionOwners[longPositionId] = msg.sender;
            positions[msg.sender] += 1;
            indexedPositions[msg.sender][
                positions[msg.sender]
            ] = longPositionId;
            positionDetails[longPositionId][msg.sender] = PositionStatus.Opened;
            totalTradePairs++;

            emit LongPositionOpened(longPositionId, msg.sender, adapter);
        }

        {
            // Call the original `openShortPosition` function
            bytes memory bytecode = type(GMXAdapter).creationCode;
            address adapter;
            assembly {
                adapter := create(0, add(bytecode, 32), mload(bytecode))
            }
            IGMXAdapter(adapter).initialize(
                ROUTER,
                POSITION_ROUTER,
                msg.sender,
                NFT_HANDLER
            );
            IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
            address collateral = _nftData._pathShort[0];
            IERC20(collateral).transferFrom(
                msg.sender,
                adapter,
                _nftData._amountIn
            );
            IGMXAdapter(adapter).approve(
                collateral,
                ROUTER,
                _nftData._amountIn
            );
            shortPositionId = IGMXAdapter(adapter).createIncreasePosition{
                value: msg.value / 2
            }(
                _nftData._pathShort,
                _nftData._indexTokenShort,
                _nftData._amountIn,
                _nftData._minOut,
                _nftData._sizeDeltaShort,
                false,
                _nftData._acceptablePriceShort
            );
            positionAdapters[shortPositionId] = adapter;
            positionOwners[shortPositionId] = msg.sender;
            positions[msg.sender] += 1;
            indexedPositions[msg.sender][
                positions[msg.sender]
            ] = shortPositionId;
            positionDetails[shortPositionId][msg.sender] = PositionStatus
                .Opened;
            totalTradePairs++;

            emit ShortPositionOpened(shortPositionId, msg.sender, adapter);
        }

        return (longPositionId, shortPositionId);
    }

    /**
     * @dev Get the position owner associated with a given position ID.
     *
     * @param _positionId The ID of the position to query.
     * @return An onwer associated with the position ID.
     */
    function getPositionOwner(
        bytes32 _positionId
    ) external view returns (address) {
        return positionOwners[_positionId];
    }

    /**
     * @dev Get the position status for a specific address associated with a given position ID.
     *
     * @param _positionId The ID of the position to query.
     * @param _address The address whose status to query.
     * @return An status of that specific position ID for the user.
     */
    function getPositionStatus(
        bytes32 _positionId,
        address _address
    ) external view returns (PositionStatus) {
        return positionDetails[_positionId][_address];
    }

    /**
     * @dev Get the position adapter associated with a given position ID.
     *
     * @param _positionId The ID of the position to query.
     * @return An adapter associated with the position ID.
     */
    function getPositionAdapter(
        bytes32 _positionId
    ) external view returns (address) {
        return positionAdapters[_positionId];
    }

    /**
     * @dev Get the total number of positions associated with a given address.
     *
     * @param _address The address of the user to query.
     * @return Number of IDs associated with the address.
     */
    function getTotalPositions(
        address _address
    ) external view returns (uint256) {
        return positions[_address];
    }

    /**
     * @dev Get the positionID associated with a given address on index.
     *
     * @param _address The address of the user to query.
     * @param _index The index of the position to query.
     * @return Position ID associated with the address on that index.
     */
    function getPositionId(
        address _address,
        uint256 _index
    ) external view returns (bytes32) {
        return indexedPositions[_address][_index];
    }

    /**
     * @dev Update the mappings upon NFT Transfer.
     *
     * @param _oldOwner The address of the previous owner of the Position.
     * @param _newOwner The address of the new owner of the Position.
     * @param _positionId The positionId whose ownership is to be transferred.
     * @return true if the transfer of the ownership is successful.
     */
    function updateOwner(
        address _oldOwner,
        address _newOwner,
        bytes32 _positionId
    ) external onlyNftHandler returns (bool) {
        positionOwners[_positionId] = _newOwner;
        positions[_newOwner] += 1;
        indexedPositions[_newOwner][positions[_newOwner]] = _positionId;
        positionDetails[_positionId][_oldOwner] = PositionStatus.Transferred;
        positionDetails[_positionId][_newOwner] = PositionStatus.Opened;

        return true;
    }

    /**
     * @dev Function to get total number of Trade Pairs created.
     *
     * @return Number of total trade pairs created by the GMX Factory contract.
     */
    function getTotalTradePairs() external view returns (uint256) {
        return totalTradePairs;
    }

    /**
     * @dev Function to decrease total number of Trade Pairs created.
     *
     * @return Number of total trade pairs created by the GMX Factory contract.
     */
    function decreaseTotalTradePairs() external onlyAdapter returns (uint256) {
        return totalTradePairs--;
    }

    /**
     *  @dev Platform Logic Admin Acess Control functions
     */

    /// @notice calls platform logic and changes factories's access permissions
    /// @dev used when updating to a new factory or adding an existing one to the platform logic contract
    /// @param _factory the factory address to be added/removed
    /// @param _state boolean value that determines if certain address has factory access control permissions
    function setFactory(address _factory, bool _state) external onlyOwner {
        PLATFORM_LOGIC.setFactory(_factory, _state);

        emit PlatformLogicsFactoryChanged(_factory, _state);
    }

    function setPlatformLogic(
        IPlatformLogic _platformLogic
    ) external onlyOwner {
        emit PlatformLogicChanged(PLATFORM_LOGIC, _platformLogic);
        PLATFORM_LOGIC = _platformLogic;
    }

    /// @notice sets the referee discount amount
    function setRefereeDiscount(uint256 _refereeDiscount) external onlyOwner {
        PLATFORM_LOGIC.setRefereeDiscount(_refereeDiscount);
    }

    /// @notice sets the referrer fee
    function setReferrerFee(uint256 _referrerFee) external onlyOwner {
        PLATFORM_LOGIC.setReferrerFee(_referrerFee);
    }

    /// @notice sets the platform fee %
    function setPlatformFee(uint256 _platformFee) external onlyOwner {
        PLATFORM_LOGIC.setPlatformFee(_platformFee);
    }

    /// @notice sets the treasury fee split %
    function setTreasuryFeeSplit(uint256 _treasuryFeeSplit) external onlyOwner {
        PLATFORM_LOGIC.setTreasuryFeeSplit(_treasuryFeeSplit);
    }

    /// @notice sets the stakers fee split %
    function setStakersFeeSplit(uint256 _stakersFeeSplit) external onlyOwner {
        PLATFORM_LOGIC.setStakersFeeSplit(_stakersFeeSplit);
    }

    /// @notice changes the spectra treasury address
    function changePectraTreasury(
        address payable _newTreasury
    ) external onlyOwner {
        PLATFORM_LOGIC.changePectraTreasury(_newTreasury);
    }

    /// @notice changes the spectra staking contract address
    function changePectraStakingContract(
        address payable _newStakingContract
    ) external onlyOwner {
        PLATFORM_LOGIC.changePectraStakingContract(_newStakingContract);
    }

    /// @notice used so admins can edit a users referral code or set custom ones
    function editReferralCode(
        address _referee,
        bytes32 _referralCode
    ) external onlyOwner {
        PLATFORM_LOGIC.editReferralCode(_referee, _referralCode);
    }

    /// @notice used so admins can edit users who are referred
    function editReferredUsers(
        address _referrer,
        bytes32 _referralCode
    ) external onlyOwner {
        PLATFORM_LOGIC.editReferredUsers(_referrer, _referralCode);
    }

    function tokenTransferPlatformLogic(
        IERC20 _token,
        address _from,
        address _to,
        uint256 _amount
    ) external onlyAllowedTokens(_token) onlyPlatformLogic returns (bool) {
        bool success = _token.transferFrom(_from, _to, _amount);
        if (!success) revert TransactionFailedOnTokenTransfer();
        return true;
    }
}
