// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @dev Interface of the Position Router contract of GMX.
 */
interface IPositionRouter {
   /**
    * @dev Get the minimum execution fee required for a position request.
    * @return The minimum execution fee required in wei.
    */
   function minExecutionFee() external returns (uint256);

   /**
    * @dev Create an increase position request in the GMX Position Router.
    *
    * @param _path The token path for the increase position request.
    * @param _indexToken The index token for the increase position request.
    * @param _amountIn The amount of tokens to invest in the increase position request.
    * @param _minOut The minimum acceptable amount of output tokens for the increase position request.
    * @param _sizeDelta The amount of leverage taken from the exchange for the increase position request.
    * @param _isLong A boolean indicating if the increase position request is for a long position (true) or short position (false).
    * @param _acceptablePrice The acceptable price for the increase position request.
    * @param _executionFee The execution fee for the increase position request.
    * @param _referralCode The referral code for the increase position request.
    * @param _callbackTarget The callback target address for the increase position request.
    * @return positionId The ID of the created increase position request.
    */
   function createIncreasePosition(
      address[] memory _path,
      address _indexToken,
      uint256 _amountIn,
      uint256 _minOut,
      uint256 _sizeDelta,
      bool _isLong,
      uint256 _acceptablePrice,
      uint256 _executionFee,
      bytes32 _referralCode,
      address _callbackTarget
   ) external payable returns (bytes32);

   /**
    * @dev Create an increase position request with ETH collateral in the GMX Position Router.
    *
    * @param _path The token path for the increase position request.
    * @param _indexToken The index token for the increase position request.
    * @param _minOut The minimum acceptable amount of output tokens for the increase position request.
    * @param _sizeDelta The amount of leverage taken from the exchange for the increase position request.
    * @param _isLong A boolean indicating if the increase position request is for a long position (true) or short position (false).
    * @param _acceptablePrice The acceptable price for the increase position request.
    * @param _executionFee The execution fee for the increase position request.
    * @param _referralCode The referral code for the increase position request.
    * @param _callbackTarget The callback target address for the increase position request.
    * @return positionId The ID of the created increase position request.
    */
   function createIncreasePositionETH(
      address[] memory _path,
      address _indexToken,
      uint256 _minOut,
      uint256 _sizeDelta,
      bool _isLong,
      uint256 _acceptablePrice,
      uint256 _executionFee,
      bytes32 _referralCode,
      address _callbackTarget
   ) external payable returns (bytes32);

   /**
    * @dev Create a decrease position request in the GMX Position Router.
    *
    * @param _path The token path for the decrease position request.
    * @param _indexToken The index token for the decrease position request.
    * @param _collateralDelta The amount of collateral tokens to add or remove from the position.
    * @param _sizeDelta The amount of tokens to add or remove from the position.
    * @param _isLong A boolean indicating if the decrease position request is for a long position (true) or short position (false).
    * @param _receiver The address to receive the output tokens from the decrease position request.
    * @param _acceptablePrice The acceptable price for the decrease position request.
    * @param _minOut The minimum acceptable amount of output tokens for the decrease position request.
    * @param _executionFee The execution fee for the decrease position request.
    * @param _withdrawETH A boolean indicating whether to withdraw ETH collateral (true) or not (false).
    * @param _callbackTarget The callback target address for the decrease position request.
    * @return positionId The ID of the created decrease position request.
    */
   function createDecreasePosition(
      address[] memory _path,
      address _indexToken,
      uint256 _collateralDelta,
      uint256 _sizeDelta,
      bool _isLong,
      address _receiver,
      uint256 _acceptablePrice,
      uint256 _minOut,
      uint256 _executionFee,
      bool _withdrawETH,
      address _callbackTarget
   ) external payable returns (bytes32);
}
