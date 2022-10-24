// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./Escrow.sol";

contract EscrowFactory is Ownable, ReentrancyGuard {
    uint256 public createFee;
    uint256 public feePercent;
    address public feeRecipient;
    address public locker;
    uint256 lockDuration;

    mapping(address => Escrow[]) escrows;

    /// @dev implement address of project contract
    address escrowImplementation;

    constructor(
        address _locker,
        uint256 _lockDuration,
        uint256 _createFee,
        uint256 _feePercent,
        address _feeRecipient
    ) {
        locker = _locker;
        lockDuration = _lockDuration;
        createFee = _createFee;
        feeRecipient = _feeRecipient;
        feePercent = _feePercent;
    }

    function createEscrow(string memory _uri) external payable {
        require(msg.value == createFee, "Pay escrow creation fee!");
        (bool sent, ) = feeRecipient.call{value: createFee}("");
        if (sent) {
            Escrow newEscrow = Escrow(Clones.clone(escrowImplementation));
            newEscrow.initialize(
                _uri,
                msg.sender,
                locker,
                feePercent,
                feeRecipient,
                lockDuration
            );
            escrows[msg.sender].push(newEscrow);
        }
    }

    function destroy(address _owner) external {
        delete escrows[_owner];
    }
}
