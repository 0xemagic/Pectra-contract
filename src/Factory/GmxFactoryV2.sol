// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../Factory/GMXFactory.sol";
import "../NFT/IPositionNFT.sol";

contract GMXFactoryV2 is GMXFactory {
    IPositionNFT public positionNFT;
    address public owner;

    // Events
    event PositionNFTSet(address indexed positionNFTAddress);
    event BaseUriSet(string uri);

    /**
     * @dev Sets the values for Router and Position Router.
     *
     * @param _router The address of the GMX Router Contract.
     * @param _positionRouter The address of the GMX Position Router Contract.
     * @param _reader The address of the GMX reader contract.
     * @param _vault The address of the GMX vault contract.
     *
     * Both of these values are immutable: they can only be set once during construction.
     */
    constructor(address _router, address _positionRouter, address _reader, address _vault) GMXFactory(_router, _positionRouter, _reader, _vault) {
        owner = msg.sender;
    }

    /**
     * @dev Set the position NFT contract address.
     *
     * @param _positionNFTAddress The address of the position NFT contract.
     */
    function setPositionNFT(address _positionNFTAddress) external onlyOwner {
        positionNFT = IPositionNFT(_positionNFTAddress);

        // Emit the PositionNFTSet event.
        emit PositionNFTSet(_positionNFTAddress);
    }

    /**
     * @dev Set the Base URI for the NFT contract.
     *
     * @param _uri The base URI for the NFT contract.
     */
    function setBaseUri(string memory _uri) external onlyOwner {
        positionNFT.setBaseURI(_uri);

        // Emit the BaseUriSet event.
        emit BaseUriSet(_uri);
    }

    /**
     * @dev Create an NFT representing a pair of long and short positions.
     *
     * @param _pathLong The token path for the long position.
     * @param _pathShort The token path for the short position.
     * @param _indexTokenLong The index token for the long position.
     * @param _indexTokenShort The index token for the short position.
     * @param _amountIn The amount of tokens to invest.
     * @param _minOut The minimum acceptable amount of output tokens.
     * @param _sizeDeltaLong The amount of leverage taken from the exchange for the long position.
     * @param _sizeDeltaShort The amount of leverage taken from the exchange for the short position.
     * @param _acceptablePriceLong The acceptable price for the long position.
     * @param _acceptablePriceShort The acceptable price for the short position.
     */
    function createNFT(
        address[] memory _pathLong,
        address[] memory _pathShort,
        address _indexTokenLong,
        address _indexTokenShort,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDeltaLong,
        uint256 _sizeDeltaShort,
        uint256 _acceptablePriceLong,
        uint256 _acceptablePriceShort
    ) external payable {
        bytes32 longPositionId;
        bytes32 shortPositionId;

        {
            // Call the original `openLongPosition` function
            bytes memory bytecode = type(GMXAdapter).creationCode;
            address adapter;
            assembly {
                adapter := create(0, add(bytecode, 32), mload(bytecode))
            }
            IGMXAdapter(adapter).initialize(ROUTER, POSITION_ROUTER, msg.sender);
            IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
            address collateral = _pathLong[0];
            IERC20(collateral).transferFrom(msg.sender, adapter, _amountIn);
            IGMXAdapter(adapter).approve(collateral, ROUTER, _amountIn);
            longPositionId = IGMXAdapter(adapter).createIncreasePosition{ value: msg.value / 2 }(
                _pathLong,
                _indexTokenLong,
                _amountIn,
                _minOut,
                _sizeDeltaLong,
                true,
                _acceptablePriceLong
            );
            positionAdapters[longPositionId] = adapter;
            positionOwners[longPositionId] = msg.sender;
            positions[msg.sender] += 1;
            indexedPositions[msg.sender][positions[msg.sender]] = longPositionId;
        }

        {
            // Call the original `openShortPosition` function
            bytes memory bytecode = type(GMXAdapter).creationCode;
            address adapter;
            assembly {
                adapter := create(0, add(bytecode, 32), mload(bytecode))
            }
            IGMXAdapter(adapter).initialize(ROUTER, POSITION_ROUTER, msg.sender);
            IGMXAdapter(adapter).approvePlugin(POSITION_ROUTER);
            address collateral = _pathShort[0];
            IERC20(collateral).transferFrom(msg.sender, adapter, _amountIn);
            IGMXAdapter(adapter).approve(collateral, ROUTER, _amountIn);
            shortPositionId = IGMXAdapter(adapter).createIncreasePosition{ value: msg.value / 2 }(
                _pathShort,
                _indexTokenShort,
                _amountIn,
                _minOut,
                _sizeDeltaShort,
                false,
                _acceptablePriceShort
            );
            positionAdapters[shortPositionId] = adapter;
            positionOwners[shortPositionId] = msg.sender;
            positions[msg.sender] += 1;
            indexedPositions[msg.sender][positions[msg.sender]] = shortPositionId;
        }

        // Mint the NFT with the long and short position IDs
        positionNFT.mint(msg.sender, longPositionId, shortPositionId);
    }
}
