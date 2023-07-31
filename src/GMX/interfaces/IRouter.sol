// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @dev Interface for the GMX Router contract.
 */
interface IRouter {
   /**
    * @dev Approve a plugin contract to interact with the GMX Router.
    *
    * @param _plugin The address of the plugin contract to be approved.
    */
   function approvePlugin(address _plugin) external;

   /**
    * @dev Get the address of the GMX vault.
    *
    * @return vault The address of the GMX vault.
    */
   function vault() external returns (address);
}
