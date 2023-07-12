// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IPositionNFT {
    function mint(
        address to,
        bytes32 _long,
        bytes32 _short
    ) external returns (uint256);

    function setBaseURI(string memory uri_) external;
}
