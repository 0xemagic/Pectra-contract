// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./IPlatformLogic.sol";
import "./PlatformLogic.sol";

// This contract is serving as middleman, mocking the Adapter/Factory calls
contract Call {
    PlatformLogic platformLogic;

    constructor(address _addr) {
        platformLogic = PlatformLogic(_addr);
    }

    // fee logic functions

    function callApplyPlatformFeeEth(
        address _referee,
        uint256 _grossAmount
    ) external payable {
        platformLogic.applyPlatformFeeEth{value: msg.value}(
            _referee,
            _grossAmount
        );
    }

    function callApplyPlatformFeeErc20(
        address _referee,
        uint256 _grossAmount,
        IERC20 _tokenAddress,
        address _factory
    ) external {
        platformLogic.applyPlatformFeeErc20(
            _referee,
            _grossAmount,
            _tokenAddress,
            _factory
        );
    }

    function callWithdrawEthFees() external {
        platformLogic.withdrawEthFees();
    }

    function callWithdrawTokenFees(IERC20 _token) external {
        platformLogic.withdrawTokenFees(_token);
    }

    // referral logic functions

    function callCreate(bytes32 _referralCode) external {
        platformLogic.createReferralCode(_referralCode);
    }

    function callAddReferee(bytes32 _referralCode) external {
        platformLogic.addReferee(_referralCode);
    }

    function callEditReferralCode(
        address _referrer,
        bytes32 _referralCode
    ) external {
        platformLogic.editReferralCode(_referrer, _referralCode);
    }

    function callEditReferredUsers(
        address _referrer,
        bytes32 _referralCode
    ) external {
        platformLogic.editReferredUsers(_referrer, _referralCode);
    }

    function callSetFactory(address _factory, bool _state) external {
        platformLogic.setFactory(_factory, _state);
    }
}
