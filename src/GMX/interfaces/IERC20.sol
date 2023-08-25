// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @dev Interface of the ERC-20 token standard.
 */
interface IERC20 {
    /**
     * @dev Get the balance of the specified account.
     *
     * @param account The address of the account to get the balance for.
     * @return The balance of the account.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    /**
     * @dev Transfer an amount of tokens to a specified recipient.
     *
     * @param to The address of the recipient to transfer tokens to.
     * @param amount The amount of tokens to transfer.
     * @return A boolean value indicating if the transfer was successful or not.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Approve the specified spender to spend a certain amount of tokens on behalf of the caller.
     *
     * @param spender The address of the spender to be approved.
     * @param amount The maximum amount of tokens that the spender is allowed to spend.
     * @return A boolean value indicating if the approval was successful or not.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Transfer an amount of tokens from one address to another.
     *
     * @param from The address from which tokens will be transferred.
     * @param to The address of the recipient to transfer tokens to.
     * @param amount The amount of tokens to transfer.
     * @return A boolean value indicating if the transfer was successful or not.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
