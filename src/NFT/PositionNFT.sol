// solhint-disable
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PositionNFT is ERC721Enumerable {
    uint256 public lastTokenId;
    string public baseURI;
    address public owner;

    // Events
    event NftCreated(address owner, uint256 tokenId, bytes32 longId, bytes32 shortId);

    // Structure to store the long and short position IDs associated with each NFT token.
    struct PositionIDs {
        bytes32 shortID;
        bytes32 longID;
    }

    // Mapping to associate each token ID with its corresponding long and short position IDs.
    mapping(uint256 => PositionIDs) public tokenList;

    // Modifier to restrict access to only the factory (owner) that mints NFTs.
    modifier onlyFactory() {
        require(msg.sender == owner, "PositionNFT: NOT_FACTORY");
        _;
    }

    /**
     * @dev Constructor to initialize the PositionNFT contract.
     *
     * @param owner_ The address of the contract owner (factory).
     * @param name_ The name of the NFT contract.
     * @param symbol_ The symbol of the NFT contract.
     * @param uri_ The base URI for the NFT contract.
     */
    constructor(
        address owner_,
        string memory name_,
        string memory symbol_,
        string memory uri_
    ) ERC721(name_, symbol_) {
        require(owner_ != address(0), "PositionNFT: INVALID_ADDRESS");
        owner = owner_;
        baseURI = uri_;
    }

    /**
     * @dev Mint an NFT representing a pair of long and short positions.
     *
     * @param to The address to which the NFT will be minted and transferred.
     * @param _long The ID of the long position to be associated with the NFT.
     * @param _short The ID of the short position to be associated with the NFT.
     * @return The token ID of the newly minted NFT.
     */
    function mint(
        address to,
        bytes32 _long,
        bytes32 _short
    ) external onlyFactory returns (uint256) {
        _mint(to, ++lastTokenId);
        tokenList[lastTokenId].longID = _long;
        tokenList[lastTokenId].shortID = _short;
        emit NftCreated(owner, lastTokenId, _long, _short);
        return lastTokenId;
    }

    /**
     * @dev Set the base URI for the NFT contract.
     *
     * @param uri_ The new base URI for the NFT contract.
     */
    function setBaseURI(string memory uri_) external onlyFactory {
        baseURI = uri_;
    }

    /**
     * @dev Internal function to return the base URI for the NFT token.
     *
     * @return The base URI for the NFT token.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Returns the URI for a given NFT token ID.
     *
     * @param tokenId The token ID for which to return the URI.
     * @return The URI for the specified token ID.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
        _requireMinted(tokenId);

        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, Strings.toString(tokenId)))
                : "";
    }
}
