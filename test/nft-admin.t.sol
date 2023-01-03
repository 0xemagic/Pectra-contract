// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721Enumerable {
    mapping(address => uint256) public contractToId;

    constructor() ERC721("MyNFT", "MNFT") {}

    function deployAndMint(uint256 _number) public returns (address, uint256) {
        ControlledByNFT controlledByNFT = new ControlledByNFT(
            address(this),
            _number
        );
        uint256 id = totalSupply() + 1;
        contractToId[address(controlledByNFT)] = id;
        _safeMint(msg.sender, id);
        return (address(controlledByNFT), id);
    }
}

contract ControlledByNFT {
    MyNFT public nft;
    uint256 public number;

    constructor(address _nft, uint256 _number) {
        nft = MyNFT(_nft);
        number = _number;
    }

    modifier onlyNFTOwner() {
        require(
            msg.sender == nft.ownerOf(nft.contractToId(address(this))),
            "ControlledByNFT: not nft owner"
        );
        _;
    }

    function changeNumber(uint256 _number) public onlyNFTOwner {
        number = _number;
    }
}

contract NFTAdminTest is Test {
    MyNFT public nft;
    address public alice = address(0xa);
    address public bob = address(0xb);

    function setUp() public {
        nft = new MyNFT();
    }

    function testMint() public {
        vm.prank(alice);
        (address newContract, ) = nft.deployAndMint(69);
        assertEq(nft.ownerOf(1), alice, "alice should be the owner of the NFT");
        assertEq(
            ControlledByNFT(newContract).number(),
            69,
            "number should be equal"
        );
        vm.prank(bob);
        vm.expectRevert();
        ControlledByNFT(newContract).changeNumber(42);

        vm.prank(alice);
        ControlledByNFT(newContract).changeNumber(42);
        assertEq(
            ControlledByNFT(newContract).number(),
            42,
            "number should be equal"
        );
    }
}
