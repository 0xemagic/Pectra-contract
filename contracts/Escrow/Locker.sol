// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Locker is ReentrancyGuard {
    string uri;
    uint256 private constant LockDuration = 1 weeks;

    constructor() {}

    function Create(
        address _token,
        address beneficiary,
        uint256 mID,
        uint256 unlockTimestamp
    ) external {}

    function Release(uint256 lockID) external {}

    receive() external payable {}
}
