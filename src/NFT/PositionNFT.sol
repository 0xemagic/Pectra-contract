// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract PositionNFT is ERC721, ERC721Enumerable, ERC721Burnable {
    uint256 private _tokenIdCounter;

    string public baseURI;
    address public owner;

    // Events
    event NftCreated(address owner, uint256 tokenId, bytes32[] positionIds);

    // Mapping to associate each token ID with its corresponding long and short position IDs.
    mapping(uint256 => bytes32[]) public tokenList;

    // Modifier to restrict access to only the factory (owner) that mints NFTs.
    modifier onlyNftHandler() {
        require(owner == msg.sender, "PositionNFT: Caller is not NFT Handler");
        _;
    }

    /**
     * @dev Constructor to initialize the PositionNFT contract.
     *
     * @param owner_ The address of the contract owner (NFT Handler Contract).
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
     * @param _positionIds The ID of one or more than one positions to be associated with the NFT.
     * @return The token ID of the newly minted NFT.
     */

    function safeMint(
        address to,
        bytes32[] memory _positionIds
    ) public onlyNftHandler returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        tokenList[tokenId] = _positionIds;
        emit NftCreated(owner, tokenId, _positionIds);
        return tokenId;
    }

    /**
     * @dev Override function to make sure that only NFT Handler is able to transfer the NFT.
     *
     * @param spender The address to which the NFT will be transferred.
     * @param tokenId The Token Id of the NFT we are transferring NFT.
     * @return true if the caller is NFT Handler contract.
     */
    function _isApprovedOrOwner(
        address spender,
        uint256 tokenId
    ) internal view virtual override returns (bool) {
        return (msg.sender == owner);
    }

    /**
     * @dev Set the base URI for the NFT contract.
     *
     * @param uri_ The new base URI for the NFT contract.
     */
    function setBaseURI(string memory uri_) external onlyNftHandler {
        baseURI = uri_;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, Strings.toString(tokenId)))
                : "";
    }
}
