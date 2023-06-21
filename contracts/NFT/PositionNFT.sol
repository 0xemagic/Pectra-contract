// solhint-disable
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PositionNFT is ERC721Enumerable {
    uint256 public lastTokenId;
    string public baseURI;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Hinata721: NOT_OWNER");
        _;
    }

    constructor(
        address owner_,
        string memory name_,
        string memory symbol_,
        string memory uri_
    ) ERC721(name_, symbol_) {
        require(owner_ != address(0), "Hinata721: INVALID_OWNER");
        owner = owner_;
        baseURI = uri_;
    }

    function mint(address to) external onlyOwner {
        _mint(to, ++lastTokenId);
    }

    function batchMint(address[] calldata to) external onlyOwner {
        for (uint256 i; i < to.length; i += 1) _mint(to[i], ++lastTokenId);
    }

    function setBaseURI(string memory uri_) external onlyOwner {
        baseURI = uri_;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }
}
