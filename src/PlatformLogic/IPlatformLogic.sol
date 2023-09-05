// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IPlatformLogic {
    function createReferralCode(bytes32 _referralCode) external returns (bool);

    function addReferee(bytes32 _referralCode) external returns (bool);

    function editReferralCode(
        address _referrer,
        bytes32 _referralCode
    ) external;

    function setFactory(address _factory, bool _state) external;

    function implementReferralCode(bytes32 _referralCode) external;

    function viewReferralCodeOwner(
        bytes32 _referralCode
    ) external view returns (address codeOwner);

    function viewReferrersCode(
        address _referrer
    ) external view returns (bytes32 code);

    function viewReferredUser(
        address _referredUser
    ) external view returns (bytes32 code);

    function checkReferredUser(
        address _referredUser
    ) external view returns (address referrer);

    function checkFactory(address _factory) external view returns (bool);
}
