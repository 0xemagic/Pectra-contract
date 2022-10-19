// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Escrow is ReentrancyGuard {
    string uri;
    address originator;
    uint256 milestoneID;
    struct Milestone {
        address token;
        address participant;
        uint256 amount;
        uint256 timestamp;
        string metadata;
        bool isAgree;
    }

    Milestone[] milestones;

    function initialize(string memory _uri, address _owner) public {
        uri = _uri;
        originator = _owner;
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
    ) external onlyOriginator {
        require(amount > 0, "Amount should not be zero");
        milestones.push(
            Milestone({
                token: _token,
                participant: _participant,
                amount: amount,
                timestamp: timestamp,
                metadata: metadata,
                isAgree: false
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
        milestones[mID].isAgree = true;
    }

    function depositMilestone(uint256 mID) external {}

    function requestMilestone(uint256 mID) external {}

    function releaseMilestone(uint256 mID) external {}

    function createDispute(uint256 mID) external {}

    function resolveDispute(uint256 mID) external {}

    function cancelDispute(uint256 mID) external {}

    function destroy() external {}
}
