// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Escrow is ReentrancyGuard {
    uint256[5] members;

    constructor(uint256 _amount, address _feeRecipient) {}

    function enterLottery() external {}
}
