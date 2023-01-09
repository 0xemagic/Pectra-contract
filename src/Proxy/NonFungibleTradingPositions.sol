// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {PectraImplementation} from "./PectraImplementation.sol";

import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ControlledByNFT {
    NonFungibleTradingPositions public nft;
    uint256 public number;

    constructor(address _nft, uint256 _number) {
        nft = NonFungibleTradingPositions(_nft);
        number = _number;
    }

    modifier onlyNFTOwner() {
        require(
            msg.sender == nft.ownerOf(nft.contractToId(address(this))),
            "NonFungibleTradingPositions: not nft owner"
        );
        _;
    }

    function changeNumber(uint256 _number) public onlyNFTOwner {
        number = _number;
    }
}

struct PositionMetadata {
    address instance;
    uint256 number;
}

contract NonFungibleTradingPositions is ERC721Enumerable {
    address public currentImplementation;

    mapping(address => uint256) public contractToId;
    mapping(uint256 => PositionMetadata) public idToMetadata;

    constructor(address _implementation)
        ERC721("Pectra Trading Positions", "PECTRA")
    {
        currentImplementation = _implementation;
    }

    function deployProxy(uint256 number) public returns (address) {
        ERC1967Proxy proxy = new ERC1967Proxy(currentImplementation, "");
        PectraImplementation instance = PectraImplementation(address(proxy));
        instance.initialize(number, msg.sender);
        // proxyControllers[address(proxy)] = msg.sender;
        return address(proxy);
    }

    function deployAndMint(uint256 _number) public returns (address, uint256) {
        ControlledByNFT controlledByNFT = new ControlledByNFT(
            address(this),
            _number
        );
        uint256 id = totalSupply() + 1;
        contractToId[address(controlledByNFT)] = id;
        idToMetadata[id] = PositionMetadata(address(controlledByNFT), _number);
        _safeMint(msg.sender, id);
        return (address(controlledByNFT), id);
    }
}
