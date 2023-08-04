// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
import "../GMX/interfaces/IGMXAdapter.sol";
import "../../lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";

contract GMXAdapter is Initializable {
   // Contract variables
   address public FACTORY;
   address public OWNER;
   address public ROUTER;
   address public POSITION_ROUTER;
   address constant ZERO_ADDRESS = address(0);
   bytes32 constant ZERO_VALUE = 0x0000000000000000000000000000000000000000000000000000000000000000;

   // Position data variables
   address[] path;
   address collateralToken;
   address indexToken;
   uint256 amountIn;
   uint256 minOut;
   uint256 sizeDelta;
   bool isLong;
   uint256 acceptablePrice;

   // Events
   event TokenApproval(address indexed token, address indexed spender, uint256 amount);
   event PluginApproval(address indexed plugin);
   event TokenWithdrawal(address indexed token, address indexed to, uint256 amount);
   event EthWithdrawal(address indexed to, uint256 amount);

   // Modifier to restrict access to only the contract owner or factory contract.
   modifier onlyOwner() {
      require(OWNER == msg.sender || FACTORY == msg.sender, "GMX ADAPTER: caller is not the owner or factory");
      _;
   }

   // Fallback function to receive ETH.
   receive() external payable {}

   // Constructor
   constructor() {
      FACTORY = msg.sender;
   }

   /**
    * @dev Initialize the contract with required addresses.
    *
    * @param _router The address of the GMX Router Contract.
    * @param _positionRouter The address of the GMX Position Router Contract.
    * @param _owner The owner address who can call certain functions.
    */
   function initialize(address _router, address _positionRouter, address _owner) external {
      require(msg.sender == FACTORY, "GMX ADAPTER:  FORBIDDEN"); // Sufficient check for factory contract.
      ROUTER = _router;
      POSITION_ROUTER = _positionRouter;
      OWNER = _owner;
   }

   // Function to approve an ERC20 token for a spender.
   function approve(address token, address spender, uint256 amount) external onlyOwner returns (bool) {
      bool success = IERC20(token).approve(spender, amount);
      if (success) {
         emit TokenApproval(token, spender, amount);
      }
      return success;
   }

   /**
    * @dev Approve a plugin for the GMX Router.
    *
    * @param _plugin The address of the plugin to be approved.
    */
   function approvePlugin(address _plugin) external onlyOwner {
      IRouter(ROUTER).approvePlugin(_plugin);
      emit PluginApproval(_plugin);
   }

   /**
    * @dev Create a long position using tokens as collateral.
    *
    * @param _path The token path for the long position.
    * @param _indexToken The index token for the long position.
    * @param _amountIn The amount of tokens to invest.
    * @param _minOut The minimum acceptable amount of output tokens.
    * @param _sizeDelta The amount of leverage taken from the Exchange for the long position.
    * @param _isLong Whether the position is a long position (true) or a short position (false).
    * @param _acceptablePrice The acceptable price for the long position.
    * @return positionId The ID of the newly created long position.
    */
   function createIncreasePosition(
      address[] memory _path,
      address _indexToken,
      uint256 _amountIn,
      uint256 _minOut,
      uint256 _sizeDelta,
      bool _isLong,
      uint256 _acceptablePrice
   ) external payable onlyOwner returns (bytes32 positionId) {
      uint256 _executionFee = IPositionRouter(POSITION_ROUTER).minExecutionFee();
      bytes32 result = IPositionRouter(POSITION_ROUTER).createIncreasePosition{value: msg.value}(
         _path,
         _indexToken,
         _amountIn,
         _minOut,
         _sizeDelta,
         _isLong,
         _acceptablePrice,
         _executionFee,
         ZERO_VALUE,
         ZERO_ADDRESS
      );
      setPositionData(_path, _indexToken, _amountIn, _minOut, _sizeDelta, _isLong, _acceptablePrice);
      return result;
   }

   /**
    * @dev Create a long position using ETH as collateral.
    *
    * @param _path The token path for the long position.
    * @param _indexToken The index token for the long position.
    * @param _minOut The minimum acceptable amount of output tokens.
    * @param _sizeDelta The amount of leverage taken from the Exchange for the long position.
    * @param _isLong Whether the position is a long position (true) or a short position (false).
    * @param _acceptablePrice The acceptable price for the long position.
    * @return positionId The ID of the newly created long position.
    */
   function createIncreasePositionETH(
      address[] memory _path,
      address _indexToken,
      uint256 _minOut,
      uint256 _sizeDelta,
      bool _isLong,
      uint256 _acceptablePrice
   ) external payable onlyOwner returns (bytes32 positionId) {
      uint256 _executionFee = IPositionRouter(POSITION_ROUTER).minExecutionFee();
      bytes32 result = IPositionRouter(POSITION_ROUTER).createIncreasePositionETH{value: msg.value}(
         _path,
         _indexToken,
         _minOut,
         _sizeDelta,
         _isLong,
         _acceptablePrice,
         _executionFee,
         ZERO_VALUE,
         ZERO_ADDRESS
      );
      setPositionData(_path, _indexToken, msg.value - _executionFee, _minOut, _sizeDelta, _isLong, _acceptablePrice);
      return result;
   }

   /**
    * @dev Close a position.
    *
    * @param _path The token path for the position to be closed.
    * @param _receiver The address to which the collateral will be transferred after closing the position.
    * @param _acceptablePrice The acceptable price for closing the position.
    * @param _withdrawETH Whether to withdraw ETH after closing the position.
    * @return positionId The ID of the position to be closed.
    */
   function closePosition(
      address[] memory _path,
      address _receiver,
      uint256 _acceptablePrice,
      bool _withdrawETH
   ) external payable onlyOwner returns (bytes32 positionId) {
      uint256 _executionFee = IPositionRouter(POSITION_ROUTER).minExecutionFee();

      // Try to close the position using the GMX Position Router.
      bytes32 result = IPositionRouter(POSITION_ROUTER).createDecreasePosition{value: msg.value}(
         _path,
         indexToken,
         0,
         sizeDelta,
         isLong,
         _receiver,
         _acceptablePrice,
         0,
         _executionFee,
         _withdrawETH,
         ZERO_ADDRESS
      );
      return result;
   }

   /**
    * @dev Close a position that was rejected by the GMX.
    *
    * @param _path The token path for the position to be closed.
    * @param _receiver The address to which the collateral will be transferred after closing the position.
    */
   function closeFailedPosition(address[] memory _path, address _receiver) external payable onlyOwner {
      address collateral = _path[_path.length - 1];
      uint256 collateralBalance = IERC20(collateral).balanceOf(address(this));
      if (collateralBalance > 0) {
         IERC20(collateral).transfer(_receiver, collateralBalance);
      } else if (address(this).balance > 0) {
         (bool success, ) = _receiver.call{value: address(this).balance}("");
         require(success, "GMX ADAPTER: Transfer failed!");
      }
   }

   /**
    * @dev Withdraw an ERC20 token from the contract.
    *
    * @param _token The address of the ERC20 token to withdraw.
    * @param _to The address to which the tokens will be transferred.
    * @param _amount The amount of tokens to withdraw.
    * @return true if the withdrawal was successful, otherwise false.
    */
   function withdrawToken(address _token, address _to, uint256 _amount) external onlyOwner returns (bool) {
      bool success = IERC20(_token).transfer(_to, _amount);
      if (success) {
         emit TokenWithdrawal(_token, _to, _amount);
      }
      return success;
   }

   /**
    * @dev Withdraw ETH from the contract.
    *
    * @param _to The address to which the ETH will be transferred.
    * @param _amount The amount of ETH to withdraw.
    * @return true if the withdrawal was successful, otherwise false.
    */
   function withdrawEth(address _to, uint256 _amount) external onlyOwner returns (bool) {
      bool success;
      (success, ) = _to.call{value: _amount}("");
      require(success, "GMX ADAPTER: Transfer failed!");
      if (success) {
         emit EthWithdrawal(_to, _amount);
      }
      return success;
   }

   /**
    * @dev Set position data for the long/short position.
    *
    * @param _path The token path for the position.
    * @param _indexToken The index token for the position.
    * @param _amountIn The amount of tokens invested.
    * @param _minOut The minimum acceptable amount of output tokens.
    * @param _sizeDelta The amount of leverage taken from the Exchange for the position.
    * @param _isLong Whether the position is a long position (true) or a short position (false).
    * @param _acceptablePrice The acceptable price for the position.
    */
   function setPositionData(
      address[] memory _path,
      address _indexToken,
      uint256 _amountIn,
      uint256 _minOut,
      uint256 _sizeDelta,
      bool _isLong,
      uint256 _acceptablePrice
   ) internal {
      path = _path;
      collateralToken = _path[_path.length - 1];
      indexToken = _indexToken;
      amountIn = _amountIn;
      minOut = _minOut;
      sizeDelta = _sizeDelta;
      isLong = _isLong;
      acceptablePrice = _acceptablePrice;
   }

   /**
    * @dev Get the position data for the long/short position.
    *
    * @return The position data including path, collateral token, index token, amount invested, minimum acceptable output,
    *         leverage amount, whether it is a long position or not, and the acceptable price for the position.
    */
   function getPositionData()
      external
      view
      returns (address[] memory, address, address, uint256, uint256, uint256, bool, uint256)
   {
      return (path, collateralToken, indexToken, amountIn, minOut, sizeDelta, isLong, acceptablePrice);
   }

   /**
    * @dev To change the owner of the position in case of NFT is transfereed.
    *
    * @param _newowner The address to which the position will be transferred.
    */
   function changePositonOwner(address _newowner) external onlyOwner{
      OWNER = _newowner;
   }
}
