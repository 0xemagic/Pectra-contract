// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./Escrow.sol";

contract EscrowInit is Ownable, ReentrancyGuard {
    uint256 public createFee;
    uint256 public feePercent;
    address public feeRecipient;
    address public locker;
    uint256 lockDuration;

    mapping(address => Escrow[]) public escrows;
    mapping(address => bool) public isEscrow;

    /// @dev implement address of project contract
    address escrowImplementation;

    constructor(
        address _locker,
        uint256 _lockDuration,
        uint256 _createFee,
        uint256 _feePercent,
        address _feeRecipient,
        address _escrowImplementation
    ) {
        locker = _locker;
        lockDuration = _lockDuration;
        createFee = _createFee;
        feeRecipient = _feeRecipient;
        feePercent = _feePercent;
        escrowImplementation = _escrowImplementation;
    }

    function createEscrow(string memory _uri) external payable {
        require(msg.value == createFee, "Pay escrow creation fee!");
        (bool sent, ) = feeRecipient.call{value: createFee}("");
        require(sent, "can't create escrow");
        Escrow newEscrow = Escrow(Clones.clone(escrowImplementation));
        newEscrow.initialize(_uri, msg.sender, locker);
        escrows[msg.sender].push(newEscrow);
        isEscrow[msg.sender] = true;
    }

    // function destroy(address _owner, uint256 index) external {
    //     delete escrows[_owner];
    // }
}
