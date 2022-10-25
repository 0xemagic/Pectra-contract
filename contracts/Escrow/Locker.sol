// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Locker is ReentrancyGuard {
    using SafeERC20 for IERC20;
    struct LockInfo {
        address token;
        address beneficiary;
        uint256 amount;
        uint256 mID;
        uint256 unlockTimestamp;
    }
    LockInfo[] public lockInfo;

    constructor() {}

    function CreateLock(
        address _token,
        address _beneficiary,
        uint256 _amount,
        uint256 _mID,
        uint256 _unlockTimestamp
    ) external returns (uint256) {
        lockInfo.push(
            LockInfo({
                token: _token,
                beneficiary: _beneficiary,
                amount: _amount,
                mID: _mID,
                unlockTimestamp: _unlockTimestamp
            })
        );
        return lockInfo.length - 1;
    }

    function Release(uint256 lockID) external {
        require(lockInfo[lockID].mID >= 0, "invalid lockID");
        require(
            block.timestamp >= lockInfo[lockID].unlockTimestamp,
            "Not available fund"
        );
        IERC20(lockInfo[lockID].token).approve(
            lockInfo[lockID].beneficiary,
            lockInfo[lockID].amount
        );
        IERC20(lockInfo[lockID].token).transfer(
            lockInfo[lockID].beneficiary,
            lockInfo[lockID].amount
        );
    }

    receive() external payable {}
}
