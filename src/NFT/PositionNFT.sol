// solhint-disable
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PositionNFT is ERC721Enumerable {
    uint256 public lastTokenId;
    string public baseURI;
    address public owner;
    struct PositionIDs {
        uint256 shortID;
        uint256 longID;
    }

    mapping(uint256 => PositionIDs) public tokenList;

    modifier onlyOwner() {
        require(msg.sender == owner, "PositionNFT: NOT_OWNER");
        _;
    }

    constructor(
        address owner_,
        string memory name_,
        string memory symbol_,
        string memory uri_
    ) ERC721(name_, symbol_) {
        require(owner_ != address(0), "PositionNFT: INVALID_OWNER");
        owner = owner_;
        baseURI = uri_;
    }

    function mint(
        address to,
        uint256 _long,
        uint256 _short
    ) external onlyOwner {
        _mint(to, ++lastTokenId);
        tokenList[lastTokenId].longID = _long;
        tokenList[lastTokenId].shortID = _short;
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
                ? string(abi.encodePacked(baseURI, Strings.toString(tokenId)))
                : "";
    }
}
