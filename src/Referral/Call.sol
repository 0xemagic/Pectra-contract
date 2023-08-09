// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./IReferral.sol";
import "./Referral.sol";

// This contract is serving as middleman, mocking the Adapter/Factory calls
contract Call {
    Referral referral;

    constructor(address _addr) {
        referral = Referral(_addr);
    }

    function callCreate(bytes32 _referralCode) external {
        referral.createReferralCode(_referralCode);
    }

    function callAddReferee(bytes32 _referralCode) external {
        referral.addReferee(_referralCode);
    }

    function callEditReferralCode(
        address _referrer,
        bytes32 _referralCode
    ) external {
        referral.editReferralCode(_referrer, _referralCode);
    }

    function callEditReferredUsers(
        address _referrer,
        bytes32 _referralCode
    ) external {
        referral.editReferredUsers(_referrer, _referralCode);
    }

    function callSetFactory(address _factory, bool _state) external {
        referral.setFactory(_factory, _state);
    }
}
