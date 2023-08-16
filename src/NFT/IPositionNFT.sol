// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @dev Interface of the Position NFT.
 */
interface IPositionNFT {
    /**
     * @dev Mint a new NFT representing a one or more positions.
     *
     * @param _to The address to which the NFT will be minted.
     * @param _positionIds The IDs of the positions opened.
     * @return tokenId The ID of the minted NFT.
     */
    function mint(
        address _to,
        bytes32[] memory _positionIds
    ) external returns (uint256);

    /**
     * @dev Burn a NFT representing a pair of long and short positions.
     *
     * @param _tokenId The token Id to which the NFT will be burnt.
     * @return bool if burning was successful or not.
     */
    function burn(uint256 _tokenId) external returns (bool);

    /**
     * @dev Set the base URI for the NFT contract.
     *
     * This function allows updating the base URI for the NFT contract, which is used as a prefix to generate
     * the token URI for each NFT.
     *
     * @param uri_ The new base URI to be set.
     */
    function setBaseURI(string memory uri_) external;

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Check for the owner of tokenId.
     *
     * @param _tokenId The tokenId whose owner is to be checked.
     */
    function ownerOf(uint256 _tokenId) external view returns (address);

    /**
     * @dev Check total supply of the NFT.
     *
     * @return Total Supply of the NFT.
     */
    function totalSupply() external view returns (uint256);
}
