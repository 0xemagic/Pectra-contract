// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC20.sol";
import "./IRouter.sol";
import "./IPositionRouter.sol";

/**
 * @dev Interface of the GMX Adapter contract.
 */
interface IGMXAdapter is IERC20, IRouter, IPositionRouter {
   /**
    * @dev Initialize the GMX Adapter contract.
    *
    * @param _router The address of the GMX Router contract.
    * @param _positionRouter The address of the GMX Position Router contract.
    * @param _owner The address of the contract owner.
    */
   function initialize(address _router, address _positionRouter, address _owner) external;

   /**
    * @dev Approve the specified spender to spend a certain amount of tokens on behalf of the caller.
    *
    * @param token The address of the token to be approved.
    * @param spender The address of the spender to be approved.
    * @param amount The maximum amount of tokens that the spender is allowed to spend.
    */
   function approve(address token, address spender, uint256 amount) external;

   /**
    * @dev Create an increase position request in the GMX Position Router.
    *
    * @param _path The token path for the position.
    * @param _indexToken The index token for the position.
    * @param _amountIn The amount of tokens to invest.
    * @param _minOut The minimum acceptable amount of output tokens.
    * @param _sizeDelta The amount of leverage taken from the exchange for the position.
    * @param _isLong A boolean indicating if the position is a long position (true) or short position (false).
    * @param _acceptablePrice The acceptable price for the position.
    * @return positionId The ID of the created position request.
    */
   function createIncreasePosition(
      address[] memory _path,
      address _indexToken,
      uint256 _amountIn,
      uint256 _minOut,
      uint256 _sizeDelta,
      bool _isLong,
      uint256 _acceptablePrice
   ) external payable returns (bytes32);

   /**
    * @dev Create an increase position request with ETH collateral in the GMX Position Router.
    *
    * @param _path The token path for the position.
    * @param _indexToken The index token for the position.
    * @param _minOut The minimum acceptable amount of output tokens.
    * @param _sizeDelta The amount of leverage taken from the exchange for the position.
    * @param _isLong A boolean indicating if the position is a long position (true) or short position (false).
    * @param _acceptablePrice The acceptable price for the position.
    * @return positionId The ID of the created position request.
    */
   function createIncreasePositionETH(
      address[] memory _path,
      address _indexToken,
      uint256 _minOut,
      uint256 _sizeDelta,
      bool _isLong,
      uint256 _acceptablePrice
   ) external payable returns (bytes32);

   /**
    * @dev Close an open position in the GMX Position Router.
    *
    * @param _path The token path for the position.
    * @param _receiver The address that will receive the collateral and profits from closing the position.
    * @param _acceptablePrice The acceptable price for the position.
    * @param _withdrawETH A boolean indicating whether to withdraw ETH collateral (true) or not (false).
    * @return positionId The ID of the closed position.
    */
   function closePosition(
      address[] memory _path,
      address _receiver,
      uint256 _acceptablePrice,
      bool _withdrawETH
   ) external payable returns (bytes32);

   /**
    * @dev Close a failed position in the GMX Position Router.
    *
    * @param _path The token path for the position.
    * @param _receiver The address that will receive the remaining collateral from the failed position.
    */
   function closeFailedPosition(address[] memory _path, address _receiver) external payable;

   /**
    * @dev Withdraw an amount of tokens from the contract to a specified recipient.
    *
    * @param token The address of the token to be withdrawn.
    * @param to The address of the recipient to withdraw tokens to.
    * @param amount The amount of tokens to withdraw.
    * @return A boolean value indicating if the withdrawal was successful or not.
    */
   function withdrawToken(address token, address to, uint256 amount) external returns (bool);

   /**
    * @dev Withdraw an amount of ETH from the contract to a specified recipient.
    *
    * @param to The address of the recipient to withdraw ETH to.
    * @param amount The amount of ETH to withdraw.
    * @return A boolean value indicating if the withdrawal was successful or not.
    */
   function withdrawEth(address to, uint256 amount) external returns (bool);

   /**
    * @dev Get data about the current position.
    *
    * @return path The token path for the position.
    * @return collateralToken The address of the collateral token for the position.
    * @return indexToken The address of the index token for the position.
    * @return amountIn The amount of tokens invested in the position.
    * @return minOut The minimum acceptable amount of output tokens for the position.
    * @return sizeDelta The amount of leverage taken from the exchange for the position.
    * @return isLong A boolean indicating if the position is a long position (true) or short position (false).
    * @return acceptablePrice The acceptable price for the position.
    */
   function getPositionData()
      external
      view
      returns (
         address[] memory path,
         address collateralToken,
         address indexToken,
         uint256 amountIn,
         uint256 minOut,
         uint256 sizeDelta,
         bool isLong,
         uint256 acceptablePrice
      );

   /**
    * @dev To change the owner of the position in case of NFT is transfereed.
    *
    * @param _newowner The address to which the position will be transferred.
    */
   function changePositonOwner(address _newowner) external ;
}
