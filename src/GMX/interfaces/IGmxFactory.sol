// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC20.sol";
import "./IRouter.sol";
import "./IPositionRouter.sol";

/**
 * @dev Interface of the GMX Factory contract.
 */
interface IGMXFactory {
    /**
     * @dev Open a long position in the GMX Factory.
     *
     * @param _path The token path for the long position.
     * @param _indexToken The index token for the long position.
     * @param _amountIn The amount of tokens to invest in the long position.
     * @param _minOut The minimum acceptable amount of output tokens for the long position.
     * @param _sizeDelta The amount of leverage taken from the exchange for the long position.
     * @param _acceptablePrice The acceptable price for the long position.
     * @return positionId The ID of the created long position.
     */
    function openLongPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);

    /**
     * @dev Open a long position with ETH collateral in the GMX Factory.
     *
     * @param _path The token path for the long position.
     * @param _indexToken The index token for the long position.
     * @param _minOut The minimum acceptable amount of output tokens for the long position.
     * @param _sizeDelta The amount of leverage taken from the exchange for the long position.
     * @param _acceptablePrice The acceptable price for the long position.
     * @return positionId The ID of the created long position.
     */
    function openLongPositionEth(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);

    /**
     * @dev Open a short position in the GMX Factory.
     *
     * @param _path The token path for the short position.
     * @param _indexToken The index token for the short position.
     * @param _amountIn The amount of tokens to invest in the short position.
     * @param _minOut The minimum acceptable amount of output tokens for the short position.
     * @param _sizeDelta The amount of leverage taken from the exchange for the short position.
     * @param _acceptablePrice The acceptable price for the short position.
     * @return positionId The ID of the created short position.
     */
    function openShortPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);

    /**
     * @dev Open a short position with ETH collateral in the GMX Factory.
     *
     * @param _path The token path for the short position.
     * @param _indexToken The index token for the short position.
     * @param _minOut The minimum acceptable amount of output tokens for the short position.
     * @param _sizeDelta The amount of leverage taken from the exchange for the short position.
     * @param _acceptablePrice The acceptable price for the short position.
     * @return positionId The ID of the created short position.
     */
    function openShortPositionEth(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32);

    /**
     * @dev Close an open position in the GMX Factory.
     *
     * @param positionId The ID of the position to be closed.
     * @param _path The token path for the position.
     * @param _acceptablePrice The acceptable price for the position.
     * @param _withdrawETH A boolean indicating whether to withdraw ETH collateral (true) or not (false).
     */
    function closePosition(
        bytes32 positionId,
        address[] memory _path,
        uint256 _acceptablePrice,
        bool _withdrawETH
    ) external;

    /**
     * @dev Get the position adapter associated with a given position ID.
     *
     * @param _positionId The ID of the position to query.
     * @return An adapter associated with the position ID.
     */
    function getPositionAdapter(
        bytes32 _positionId
    ) external view returns (address);

    /**
     * @dev Get the position details associated with a given position ID.
     *
     * @param _positionId The ID of the position to query.
     * @return An array containing the all the details associated with the position ID.
     */
    function getPosition(
        bytes32 _positionId
    ) external view returns (uint256[] memory);

    /**
     * @dev Get the position owner associated with a given position ID.
     *
     * @param _positionId The ID of the position to query.
     * @return An onwer associated with the position ID.
     */
    function getPositionOwner(
        bytes32 _positionId
    ) external view returns (address);

    /**
     * @dev Get the total number of positions associated with a given address.
     *
     * @param _address The address of the user to query.
     * @return Number of IDs associated with the address.
     */
    function getTotalPositions(
        address _address
    ) external view returns (uint256);

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
     * @return Position IDs array.
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
    ) external payable returns (bytes32[] memory);

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
    ) external view returns (bytes32);
}
