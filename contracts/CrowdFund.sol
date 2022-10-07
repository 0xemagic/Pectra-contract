// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title CrowdFund
/// @notice CrowdFund project contract to collect pledged amount.
/// @dev Only creator can claim the pledged amount.

contract CrowdFund {

    /// @dev ERC20 token to invest to campaign.
    IERC20 public token;

    /// @dev struct for campaign
    struct Campaign {
        address creator;
        uint256 goal;
        uint256 pledged;
        uint256 startAt;
        uint256 endAt;
        bool claimed;
    }
    
    /// @dev current campaign number
    uint256 public index;

    /// @dev mapping for campaings
    mapping(uint256 => Campaign) public campaigns;

    /// @dev mapping for pledged amount for each campaign and user.
    mapping(uint256 => mapping(address => uint256)) public pledgedAmount;

    constructor (IERC20 _token) {
        token = _token;
    }

    /// @notice create new Campagin
    function createCampagin(uint256 _startAt, uint256 _endAt, uint256 _goal) public {
        require(block.timestamp <= _startAt, "time already over");
        require(_endAt <= _startAt + 7 days, "invalid end time");
        campaigns[index] =  Campaign({            
            creator: msg.sender,
            goal: _goal,
            startAt: _startAt,
            endAt: _endAt,
            pledged: 0,
            claimed: false
        });
        index += 1;
    }

    /// @notice user can pledge the fund to special project.
    function pledge(uint256 _id, uint256 _amount) public {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp >= campaign.startAt, "not started");
        require(block.timestamp <= campaign.endAt, "already ended");

        campaign.pledged += _amount;
        pledgedAmount[_id][msg.sender] += _amount;
        token.transferFrom(msg.sender, address(this), _amount);
    }

    /// @notice user can unpledge the fund to special project.
    function unpledge(uint256 _id, uint256 _amount) public {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp >= campaign.startAt, "not started");
        require(block.timestamp <= campaign.endAt, "already ended");

        campaign.pledged -= _amount;
        pledgedAmount[_id][msg.sender] += _amount;
        token.transfer(msg.sender, _amount);
    }

    /// @notice Only campaign creator can claim the pledged amount.
    function claim(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp >= campaign.endAt, "not ended");
        require(campaign.creator == msg.sender, "Only creator can claim");
        require(campaign.goal == campaign.pledged, "not reached to goal");
        campaign.claimed = true;
        token.transfer(campaign.creator, campaign.pledged);
    }

    /// @notice Only campaign creator can claim the pledged amount.
    function refund(uint256 _id) external {
        Campaign memory campaign = campaigns[_id];
        require(block.timestamp > campaign.endAt, "not ended");
        require(campaign.pledged < campaign.goal, "reached to goal");

        uint256 pledged = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;
        token.transfer(msg.sender, pledged);
    }

}