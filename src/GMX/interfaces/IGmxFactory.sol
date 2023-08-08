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
   function getPositionAdapter(bytes32 _positionId) external view returns(address);

   /**
    * @dev Get the position details associated with a given position ID.
    *
    * @param _positionId The ID of the position to query.
    * @return An array containing the all the details associated with the position ID.
    */
   function getPosition(bytes32 _positionId) external view returns (uint256[] memory);

   /**
    * @dev Get the position owner associated with a given position ID.
    *
    * @param _positionId The ID of the position to query.
    * @return An onwer associated with the position ID.
    */
   function getPositionOwner(bytes32 _positionId) external view returns(address);
}
