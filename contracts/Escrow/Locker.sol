// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interface/IEscrowInit.sol";
import "./interface/IEscrow.sol";
import "hardhat/console.sol";

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
    address factoryAddress;

    constructor() {}

    function setFactoryAddress(address _factory) external {
        factoryAddress = _factory;
    }

    function CreateLock(
        address _token,
        address _beneficiary,
        uint256 _amount,
        uint256 _mID,
        uint256 _unlockTimestamp
    ) external returns (uint256) {
        require(
            IEscrowInit(factoryAddress).isEscrow(msg.sender) == true,
            "not escrow contract"
        );
        lockInfo.push(
            LockInfo({
                token: _token,
                beneficiary: _beneficiary,
                amount: _amount,
                mID: _mID,
                unlockTimestamp: _unlockTimestamp
            })
        );

        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        return lockInfo.length - 1;
    }

    function Release(uint256 lockID) external {
        require(
            IEscrowInit(factoryAddress).isEscrow(msg.sender) == true,
            "not escrow contract"
        );
        require(lockInfo[lockID].mID >= 0, "invalid lockID");
        require(
            block.timestamp >= lockInfo[lockID].unlockTimestamp,
            "Not available fund"
        );
        require(
            IEscrow(msg.sender).milestones(lockInfo[lockID].mID).status ==
                IEscrow.MilestoneStatus.Deposited,
            "It is a deposted"
        );
        IERC20(lockInfo[lockID].token).safeTransfer(
            lockInfo[lockID].beneficiary,
            lockInfo[lockID].amount
        );
    }

    function ReleaseDeposited(uint256 lockID) external {
        require(
            IEscrowInit(factoryAddress).isEscrow(msg.sender) == true,
            "not escrow contract"
        );
        require(lockInfo[lockID].mID >= 0, "invalid lockID");
        // require(
        //     IEscrow(msg.sender).milestones(lockInfo[lockID].mID).status ==
        //         IEscrow.MilestoneStatus.Disputed,
        //     "It is not deposted"
        // );
        // require(isDeposited == true, "Can't resolve the active milestone");
        IERC20(lockInfo[lockID].token).safeTransfer(
            IEscrow(msg.sender).originator(),
            lockInfo[lockID].amount
        );
    }

    // fallback() external payable {}
}
