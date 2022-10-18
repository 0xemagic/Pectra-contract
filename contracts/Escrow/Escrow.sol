// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Escrow is ReentrancyGuard {
    string uri;
    address originator;
    uint256 milestoneID;
    struct milestone {
        string description;
        uint256 amount;
    }

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
    ) external {}

    function updateMilestone() external {}

    function agreeMilestone(uint256 mID) external {}

    function depositMilestone(uint256 mID) external {}

    function requestMilestone(uint256 mID) external {}

    function releaseMilestone(uint256 mID) external {}

    function createDispute(uint256 mID) external {}

    function resolveDispute(uint256 mID) external {}

    function cancelDispute(uint256 mID) external {}

    function destroy() external {}
}
