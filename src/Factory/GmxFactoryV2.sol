// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../Factory/GMXFactory.sol";
import "../NFT/IPositionNFT.sol";

contract GMXFactoryV2 is GMXFactory {
    IPositionNFT public positionNFT;
    address public owner;

    constructor(
        address _router,
        address _positionRouter
    ) GMXFactory(_router, _positionRouter) {
        owner = msg.sender;
    }

    /**
     * @dev Set the position NFT contract address.
     * @param _positionNFTAddress The address of the position NFT contract.
     */
    function setPositionNFT(address _positionNFTAddress) external onlyOwner {
        positionNFT = IPositionNFT(_positionNFTAddress);
    }

    function setBaseUri(string memory _uri) external onlyOwner {
        positionNFT.setBaseURI(_uri);
    }

    /**
     * @dev Create an NFT representing a pair of long and short positions.
     * @param _path The token path for the position.
     * @param _indexToken The index token for the position.
     * @param _amountIn The amount of tokens to invest.
     * @param _minOut The minimum acceptable amount of output tokens.
     * @param _sizeDelta The change in position size.
     * @param _acceptablePriceLong The acceptable price for the long position.
     * @param _acceptablePriceShort The acceptable price for the short position.
     */
    function createNFT(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePriceLong,
        uint256 _acceptablePriceShort
    ) external payable  {
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
        address collateral = _path[0];
        IERC20(collateral).transferFrom(msg.sender, adapter, _amountIn);
        IGMXAdapter(adapter).approve(collateral, ROUTER, _amountIn);
        longPositionId = IGMXAdapter(adapter).createIncreasePosition{value: msg.value/2}(_path, _indexToken, _amountIn, _minOut, _sizeDelta, true, _acceptablePriceLong);
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
        address collateral = _path[0];
        IERC20(collateral).transferFrom(msg.sender, adapter, _amountIn);
        IGMXAdapter(adapter).approve(collateral, ROUTER, _amountIn);
        shortPositionId = IGMXAdapter(adapter).createIncreasePosition{value: msg.value/2}(_path, _indexToken, _amountIn, _minOut, _sizeDelta, false, _acceptablePriceShort);
        positionAdapters[shortPositionId] = adapter;
        positionOwners[shortPositionId] = msg.sender;
        positions[msg.sender] += 1;
        indexedPositions[msg.sender][positions[msg.sender]] = shortPositionId;
    }
        
        // Mint the NFT with the long and short position IDs
        positionNFT.mint(msg.sender, longPositionId, shortPositionId);
    }
}
