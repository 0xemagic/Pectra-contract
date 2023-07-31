// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @dev Interface of the Position NFT.
 */
interface IPositionNFT {
   /**
    * @dev Mint a new NFT representing a pair of long and short positions.
    *
    * @param _to The address to which the NFT will be minted.
    * @param _long The ID of the long position.
    * @param _short The ID of the short position.
    * @return tokenId The ID of the minted NFT.
    */
   function mint(address _to, bytes32 _long, bytes32 _short) external returns (uint256);

   /**
    * @dev Set the base URI for the NFT contract.
    *
    * This function allows updating the base URI for the NFT contract, which is used as a prefix to generate
    * the token URI for each NFT.
    *
    * @param uri_ The new base URI to be set.
    */
   function setBaseURI(string memory uri_) external;
}
