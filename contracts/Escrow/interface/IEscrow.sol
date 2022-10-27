// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

interface IEscrow {
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

    function initialize(
        string memory _uri,
        address _owner,
        address _locker,
        uint256 _feePercent,
        address _feeRecipient,
        uint256 _lockDuration
    ) external;

    function originator() external returns (address);

    function milestones(uint256) external view returns (Milestone calldata);
}
