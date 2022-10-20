// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Interface/ILocker.sol";

contract Escrow is ReentrancyGuard {
    using SafeERC20 for IERC20;
    string uri;
    address originator;
    address locker;
    uint256 feePercent;
    address feeRecipient;
    uint256 lockDuration;
    uint256 milestoneID;

    enum MilestoneStatus {
        Created,
        Accepted,
        Canceled,
        Closed,
        Paid,
        Disputed
    }
    struct Milestone {
        address token;
        address participant;
        uint256 amount;
        uint256 timestamp;
        string metadata;
        MilestoneStatus status;
    }

    Milestone[] milestones;

    function initialize(
        string memory _uri,
        address _owner,
        address _locker,
        uint256 _feePercent,
        address _feeRecipient,
        uint256 _lockDuration
    ) public {
        uri = _uri;
        originator = _owner;
        locker = _locker;
        feePercent = _feePercent;
        feeRecipient = _feeRecipient;
        lockDuration = _lockDuration;
    }

    modifier onlyOriginator() {
        require(msg.sender == originator, "Not owner");
        _;
    }

    function createMilestone(
        address _token,
        address _participant,
        uint256 amount,
        uint256 timestamp,
        string memory metadata
    ) external payable onlyOriginator {
        require(amount > 0, "Amount should not be zero");
        milestones.push(
            Milestone({
                token: _token,
                participant: _participant,
                amount: amount,
                timestamp: timestamp,
                metadata: metadata,
                status: MilestoneStatus.Created
            })
        );
    }

    function updateMilestone(
        uint256 mID,
        address _token,
        address _participant,
        uint256 amount,
        uint256 timestamp,
        string memory metadata
    ) external onlyOriginator {
        require(milestones[mID].amount > 0, "Invalid Milestone");
        milestones[mID].token = _token;
        milestones[mID].participant = _participant;
        milestones[mID].amount = amount;
        milestones[mID].timestamp = timestamp;
        milestones[mID].metadata = metadata;
    }

    function agreeMilestone(uint256 mID) external {
        require(milestones[mID].amount > 0, "Invalid Milestone");
        milestones[mID].status = MilestoneStatus.Accepted;
    }

    function depositMilestone(uint256 mID) external {
        require(milestones[mID].amount > 0, "Invalid Milestone");

        IERC20(milestones[mID].token).transferFrom(
            originator,
            address(this),
            milestones[mID].amount
        );
    }

    function requestMilestone(uint256 mID) external {
        require(milestones[mID].amount > 0, "Invalid Milestone");
    }

    function releaseMilestone(uint256 mID) external {
        require(milestones[mID].amount > 0, "Invalid Milestone");
        require(
            milestones[mID].status > MilestoneStatus.Accepted,
            "Invalid Milestone"
        );

        uint256 milestoneFee = (milestones[mID].amount * feePercent) / 1000;
        IERC20(milestones[mID].token).transferFrom(
            originator,
            feeRecipient,
            milestoneFee
        );
        // Locker.CreateLock(
        //     milestones[mID].token,
        //     milestones[mID].participant,
        //     milestones[mID].amount - milestoneFee,
        //     mID,
        //     block.timestamp + lockDuration
        // );
        IERC20(milestones[mID].token).transferFrom(
            originator,
            locker,
            milestones[mID].amount - milestoneFee
        );
        milestones[mID].status = MilestoneStatus.Paid;
    }

    function createDispute(uint256 mID) external {
        require(milestones[mID].amount > 0, "Invalid Milestone");
        require(
            milestones[mID].status == MilestoneStatus.Paid,
            "Fund is not released"
        );

        milestones[mID].status = MilestoneStatus.Disputed;
    }

    function resolveDispute(uint256 mID) external {
        require(milestones[mID].amount > 0, "Invalid Milestone");
        require(
            milestones[mID].status == MilestoneStatus.Paid,
            "Invalid Milestone"
        );
        uint256 milestoneFee = (milestones[mID].amount * feePercent) / 1000;

        IERC20(milestones[mID].token).approve(locker, milestones[mID].amount);
        IERC20(milestones[mID].token).transferFrom(
            locker,
            originator,
            milestones[mID].amount - milestoneFee
        );
    }

    function cancelDispute(uint256 mID) external {}

    function destroy() external {}
}
