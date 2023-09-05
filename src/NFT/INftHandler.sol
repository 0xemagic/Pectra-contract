// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface INFTHandler {
    /**
     * @dev Function to set the PositionNFT contract address.
     *
     * @param _positionNFTAddress The address of the PositionNFT contract.
     */
    function setPositionNft(address _positionNFTAddress) external;

    /**
     * @dev Mint an NFT and associate it with the given position IDs.
     *
     * @param positionIDs An array of position IDs to be associated with the NFT.
     * @param to The address to which the NFT will be minted and transferred.
     * @return The token ID of the newly minted NFT.
     */
    function mintNFT(
        bytes32[] memory positionIDs,
        address to
    ) external returns (uint256);

    /**
     * @dev Burn the NFT with the given token ID if all the associated positions are closed.
     *
     * @param tokenId The token ID of the NFT to be burned.
     */
    function burnNFT(uint256 tokenId) external;

    /**
     * @dev Transfers an NFT and associate it with the given position IDs.
     *
     * @param tokenId The token ID of the NFT to be transferred.
     * @param to The address to which the NFT will be transferred.
     */
    function transferNft(uint256 tokenId, address to) external;

    /**
     * @dev Set the base URI for the NFT contract.
     *
     * @param _uri The new base URI for the NFT contract.
     */
    function setBaseUri(string memory _uri) external returns (bool);
}
