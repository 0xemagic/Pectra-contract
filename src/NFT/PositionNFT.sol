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
        bytes32 shortID;
        bytes32 longID;
    }

    mapping(uint256 => PositionIDs) public tokenList;

    modifier onlyFactory() {
        require(msg.sender == owner, "PositionNFT: NOT_FACTORY");
        _;
    }

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

    function mint(
        address to,
        bytes32 _long,
        bytes32 _short
    ) external onlyFactory returns (uint256) {
        _mint(to, ++lastTokenId);
        tokenList[lastTokenId].longID = _long;
        tokenList[lastTokenId].shortID = _short;
        return lastTokenId;
    }

    function setBaseURI(string memory uri_) external onlyFactory {
        baseURI = uri_;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

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
