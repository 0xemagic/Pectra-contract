// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

interface ILocker {
    function CreateLock(
        address _token,
        address _beneficiary,
        uint256 _amount,
        uint256 _mID,
        uint256 _unlockTimestamp
    ) external returns (uint256);

    function Release(uint256 lockID) external;

    function ReleaseDeposited(uint256 lockID) external;
}
