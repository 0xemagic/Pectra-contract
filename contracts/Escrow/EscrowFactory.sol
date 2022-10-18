// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./Escrow.sol";

contract EscrowFactory is Ownable, ReentrancyGuard {
    uint256 public createFee;
    address public feeRecipient;
    address public feePercent;

    mapping(address => Escrow[]) escrows;

    /// @dev implement address of project contract
    address escrowImplementation;

    constructor() {}

    function createEscrow(string memory _uri) external {
        Escrow newEscrow = Escrow(Clones.clone(escrowImplementation));
        newEscrow.initialize(_uri, msg.sender);
        escrows[msg.sender].push(newEscrow);
    }

    function destroy(Escrow _escrow) external {}
}
