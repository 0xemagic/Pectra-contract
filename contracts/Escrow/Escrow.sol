// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interface/ILocker.sol";
import "./interface/IEscrowInit.sol";

contract Escrow is ReentrancyGuard {
    using SafeERC20 for IERC20;
    string public uri;
    address public originator;
    address public locker;
    uint256 public milestoneID;
    address public factory;
    bool isInit;
    mapping(uint256 => uint256) public lockList;

    enum MilestoneStatus {
        Created,
        Deposited,
        Accepted,
        Rquested,
        Released,
        Disputed,
        Closed
    }
    struct Milestone {
        address token;
        address participant;
        uint256 amount;
        uint256 timestamp;
        uint256 releasedTimestamp;
        string metadata;
        MilestoneStatus status;
    }

    Milestone[] public milestones;

    function initialize(
        string calldata _uri,
        address _owner,
        address _locker
    ) public {
        require(isInit == false, "will not init again");
        uri = _uri;
        originator = _owner;
        locker = _locker;
        factory = msg.sender;
        isInit = true;
    }

    function updateMetadata(string calldata _uri) external nonReentrant {
        uri = _uri;
    }

    modifier onlyOriginator() {
        require(msg.sender == originator, "Not owner");
        _;
    }
    modifier onlyParticipant(uint256 mID) {
        require(msg.sender == milestones[mID].participant, "Not Participant");
        _;
    }

    function createMilestone(
        address _token,
        address _participant,
        uint256 amount,
        uint256 timestamp,
        string calldata metadata
    ) external onlyOriginator nonReentrant {
        require(amount > 0, "Amount should not be zero");
        milestones.push(
            Milestone({
                token: _token,
                participant: _participant,
                amount: amount,
                timestamp: timestamp,
                metadata: metadata,
                status: MilestoneStatus.Created,
                releasedTimestamp: 0
            })
        );
    }

    function updateMilestone(
        uint256 mID,
        address _token,
        address _participant,
        uint256 amount,
        uint256 timestamp,
        string calldata metadata
    ) external onlyOriginator nonReentrant {
        require(
            milestones[mID].status == MilestoneStatus.Created,
            "Invalid Milestone"
        );
        milestones[mID].token = _token;
        milestones[mID].participant = _participant;
        milestones[mID].amount = amount;
        milestones[mID].timestamp = timestamp;
        milestones[mID].metadata = metadata;
    }

    function agreeMilestone(uint256 mID)
        external
        onlyParticipant(mID)
        nonReentrant
    {
        require(
            milestones[mID].status == MilestoneStatus.Created,
            "Invalid Milestone"
        );
        milestones[mID].status = MilestoneStatus.Accepted;
    }

    function depositMilestone(uint256 mID)
        external
        onlyOriginator
        nonReentrant
    {
        require(
            milestones[mID].status == MilestoneStatus.Accepted,
            "Invalid Milestone"
        );
        IERC20(milestones[mID].token).safeTransferFrom(
            originator,
            address(this),
            milestones[mID].amount
        );
        milestones[mID].status = MilestoneStatus.Deposited;
    }

    function claimFund(uint256 mID) external nonReentrant {
        require(
            milestones[mID].status == MilestoneStatus.Released,
            "Invalid Milestone"
        );
        ILocker(locker).Release(lockList[mID]);
    }

    function requestMilestone(uint256 mID)
        external
        nonReentrant
        onlyParticipant(mID)
    {
        require(
            milestones[mID].status == MilestoneStatus.Deposited,
            "Invalid Milestone"
        );
        require(
            milestones[mID].timestamp < block.timestamp,
            "Invalid Milestone"
        );
        milestones[mID].status = MilestoneStatus.Rquested;
    }

    function releaseMilestone(uint256 mID)
        external
        onlyOriginator
        nonReentrant
    {
        require(
            milestones[mID].status == MilestoneStatus.Deposited ||
                milestones[mID].status == MilestoneStatus.Rquested,
            "Invalid Milestone"
        );

        uint256 milestoneFee = (milestones[mID].amount *
            IEscrowInit(factory).feePercent()) / 1000;
        IERC20(milestones[mID].token).safeTransfer(
            IEscrowInit(factory).feeRecipient(),
            milestoneFee
        );
        uint256 lockerID = ILocker(locker).CreateLock(
            milestones[mID].token,
            milestones[mID].participant,
            milestones[mID].amount - milestoneFee,
            mID,
            block.timestamp + IEscrowInit(factory).lockDuration()
        );
        lockList[mID] = lockerID;
        milestones[mID].releasedTimestamp = block.timestamp;
        milestones[mID].status = MilestoneStatus.Released;
    }

    function createDispute(uint256 mID) external onlyOriginator nonReentrant {
        require(
            milestones[mID].status == MilestoneStatus.Released,
            "Fund is not released"
        );
        require(
            milestones[mID].releasedTimestamp +
                IEscrowInit(factory).lockDuration() >
                block.timestamp,
            "Already Claimed"
        );

        milestones[mID].status = MilestoneStatus.Disputed;
    }

    function resolveDispute(uint256 mID)
        external
        onlyParticipant(mID)
        nonReentrant
    {
        require(
            milestones[mID].status == MilestoneStatus.Disputed,
            "Invalid Milestone"
        );
        ILocker(locker).ReleaseDeposited(lockList[mID]);
        milestones[mID].status = MilestoneStatus.Closed;
    }

    function cancelDispute(uint256 mID) external onlyOriginator nonReentrant {
        require(
            milestones[mID].status == MilestoneStatus.Disputed,
            "Invalid Milestone"
        );
        milestones[mID].status = MilestoneStatus.Released;
    }

    // function destroy() external returns (bool) {
    //     for (uint256 i = 0; i < milestones.length; i++) {
    //         if (milestones[i].status != MilestoneStatus.Released) {
    //             return false;
    //         }
    //     }
    //     selfdestruct(payable(msg.sender));
    //     return true;
    // }
}
