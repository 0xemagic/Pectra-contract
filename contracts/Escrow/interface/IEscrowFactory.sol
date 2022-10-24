// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

interface IEscrowFactory {
    function createEscrow(string memory _uri) external payable;

    function destroy(address _owner) external;
}
