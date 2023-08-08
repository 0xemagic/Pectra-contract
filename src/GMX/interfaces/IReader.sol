// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @dev Interface for the Position Reader contract of GMX.
 */
interface IReader {
    /**
     * @dev Get the positions of an account in a specific vault for multiple collateral and index tokens.
     *
     * @param _vault The address of the vault to check for positions.
     * @param _account The address of the account to check for positions.
     * @param _collateralTokens An array of collateral tokens for which positions need to be retrieved.
     * @param _indexTokens An array of index tokens for which positions need to be retrieved.
     * @param _isLong An array of booleans indicating whether the positions are for long (true) or short (false) positions.
     * @return positions An array containing the positions of the account in the given vault for each token combination.
     */
    function getPositions(
        address _vault,
        address _account,
        address[] memory _collateralTokens,
        address[] memory _indexTokens,
        bool[] memory _isLong
    ) external view returns (uint256[] memory positions);
}
