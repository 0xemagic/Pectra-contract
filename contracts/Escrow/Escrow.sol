// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interface/ILocker.sol";

contract Escrow is ReentrancyGuard {
    using SafeERC20 for IERC20;
    string public uri;
    address public originator;
    address public locker;
    uint256 public feePercent;
    address public feeRecipient;
    uint256 public lockDuration;
    uint256 public milestoneID;
    mapping(uint256 => uint256) public lockList;

    enum MilestoneStatus {
        Created,
        Deposited,
        Accepted,
        Released,
        Disputed
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

    function updateMetadata(string memory _uri) external nonReentrant {
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
        string memory metadata
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
        string memory metadata
    ) external onlyOriginator nonReentrant {
        require(
            milestones[mID].status == MilestoneStatus.Created ||
                milestones[mID].status == MilestoneStatus.Deposited ||
                milestones[mID].status != MilestoneStatus.Accepted,
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
            milestones[mID].status == MilestoneStatus.Deposited,
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
            milestones[mID].status == MilestoneStatus.Created,
            "Invalid Milestone"
        );
        IERC20(milestones[mID].token).transferFrom(
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

    function requestMilestone(uint256 mID) external nonReentrant {
        // require(milestones[mID].amount > 0, "Invalid Milestone");
        // require(
        //     milestones[mID].status == MilestoneStatus.Deposited,
        //     "Invalid Milestone"
        // );
        // ILocker(locker).Release(lockList[mID]);
    }

    function releaseMilestone(uint256 mID)
        external
        onlyOriginator
        nonReentrant
    {
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
        uint256 lockerID = ILocker(locker).CreateLock(
            milestones[mID].token,
            milestones[mID].participant,
            milestones[mID].amount - milestoneFee,
            mID,
            block.timestamp + lockDuration
        );
        lockList[mID] = lockerID;
        milestones[mID].releasedTimestamp = block.timestamp;
        IERC20(milestones[mID].token).transferFrom(
            originator,
            locker,
            milestones[mID].amount - milestoneFee
        );
        milestones[mID].status = MilestoneStatus.Released;
    }

    function createDispute(uint256 mID) external onlyOriginator nonReentrant {
        require(
            milestones[mID].status == MilestoneStatus.Released,
            "Fund is not released"
        );
        require(
            milestones[mID].releasedTimestamp + lockDuration > block.timestamp,
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
        uint256 milestoneFee = (milestones[mID].amount * feePercent) / 1000;

        IERC20(milestones[mID].token).approve(locker, milestones[mID].amount);
        IERC20(milestones[mID].token).transferFrom(
            locker,
            originator,
            milestones[mID].amount - milestoneFee
        );
    }

    function cancelDispute(uint256 mID) external onlyOriginator nonReentrant {
        require(
            milestones[mID].status == MilestoneStatus.Disputed,
            "Invalid Milestone"
        );
        milestones[mID].status = MilestoneStatus.Released;
    }

    function destroy() external returns (bool) {
        for (uint256 i = 0; i < milestones.length; i++) {
            if (milestones[i].status != MilestoneStatus.Released) {
                return false;
            }
        }
        selfdestruct(payable(msg.sender));
        return true;
    }
}
