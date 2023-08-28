// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "forge-std/Test.sol";
import "../../src/PlatformLogic/Call.sol";
import "../../src/PlatformLogic/PlatformLogic.sol";
import "../../src/PlatformLogic/IPlatformLogic.sol";
import "forge-std/console.sol";

contract ReferralTest is Test {
    PlatformLogic platformLogic;

    // Call is a mock caller pretenting to be GMX Adapter or Factory
    Call call;

    // random referral code
    bytes32 referralCode1 = "asd";

    // another random referral code
    bytes32 referralCode2 = "asdf";

    function setUp() public {
        address factory = vm.addr(9);
        address treasury = vm.addr(10);
        address staking = vm.addr(10);

        platformLogic = new PlatformLogic(
            factory,
            payable(treasury),
            payable(staking)
        );

        call = new Call(address(platformLogic));

        vm.prank(factory, factory);

        platformLogic.setFactory(address(call), true);
    }

    // createReferralCode function test
    /// @notice assigns a referral code to the user
    function test_CreateReferralCode() public {
        address account2 = vm.addr(4);

        vm.prank(account2, account2);

        call.callCreate(referralCode1);

        assertEq(platformLogic.viewReferralCodeOwner(referralCode1), account2);
    }

    // createReferralCode function test
    /// @notice should revery when the caller already has a referral code assigned to him
    // to prevent from duplication or switching of referral codes
    function test_RevertWhen_CallerAlreadyHasAReferralCode() public {
        call.callCreate(referralCode1);

        vm.expectRevert(Unavailable.selector);

        call.callCreate(referralCode2);
    }

    // createReferralCode function test
    /// @notice should revert when the code is unavailable
    function test_RevertWhen_ReferralCodeIsTaken() public {
        call.callCreate(referralCode1);

        vm.expectRevert(Unavailable.selector);

        call.callCreate(referralCode1);
    }

    // AddReferee function test
    /// @notice should add a referee
    function test_AddReferee() public {
        address account1 = vm.addr(2);

        vm.prank(account1, account1);

        call.callCreate(referralCode1);

        address account2 = vm.addr(4);

        vm.prank(account2, account2);

        call.callAddReferee(referralCode1);

        assertEq(platformLogic.viewReferredUser(account2), referralCode1);
    }

    // AddReferee function test
    /// @notice should revert when the code has already been assigned
    function test_RevertWhen_RefereeHasACodeAlreadyAssigned() public {
        call.callCreate(referralCode1);

        address account2 = vm.addr(4);

        vm.prank(account2, account2);

        call.callAddReferee(referralCode1);

        vm.expectRevert(Unavailable.selector);

        vm.prank(account2, account2);

        call.callAddReferee(referralCode1);
    }

    // AddReferee function test
    /// @notice should revert when the code does not exist
    function test_RevertWhen_TheCodeDoesNotExist() public {
        vm.expectRevert(Unavailable.selector);

        call.callAddReferee(referralCode1);
    }

    // checkReferredUser view function test
    /// @notice checks who referred a given user
    function test_CheckWhoReferredUser() public {
        address account1 = vm.addr(2);

        vm.prank(account1, account1);

        call.callCreate(referralCode1);

        address account2 = vm.addr(4);

        vm.prank(account2, account2);

        call.callAddReferee(referralCode1);

        assertEq(platformLogic.checkReferredUser(account2), account1);
    }

    // AddReferee function test
    /// @notice should revert when a EOA tries to refer himself
    function test_RevertWhen_UserTriesToReferHimself() public {
        call.callCreate(referralCode1);

        vm.expectRevert(Unavailable.selector);

        call.callAddReferee(referralCode1);
    }

    // Factory edit referral code tests
    /// @notice should let the factory to edit referral codes of users
    function test_EditReferralCode() public {
        address user = vm.addr(3);
        vm.prank(user, user);
        call.callCreate(referralCode1);

        // asserts users code to ref code 1
        assertEq(platformLogic.viewReferrersCode(user), referralCode1);

        address factory = vm.addr(9);
        vm.prank(factory, factory);

        call.callEditReferralCode(user, referralCode2);

        // asserts users code to ref code 2
        assertEq(platformLogic.viewReferrersCode(user), referralCode2);
    }

    // Factory edit referral code access control test
    /// @notice should revert when caller is not the factory
    /// @dev implement this test when applying access control on the factory side
    // logic is made so the factory can edit referral codes, but this should be accessible only to factory admins
    function test_RevertWhen_ReferralCodeEditIsNotCalledByFactory() public {
        address user = vm.addr(3);
        vm.prank(user, user);
        call.callCreate(referralCode1);

        // asserts users code to ref code 1
        assertEq(platformLogic.viewReferrersCode(user), referralCode1);

        // no factory access control, not whitelisted address
        Call call2 = new Call(address(platformLogic));

        address notfactory = vm.addr(9);
        vm.prank(notfactory, notfactory);
        vm.expectRevert(NotAdmin.selector);

        call2.callEditReferralCode(user, referralCode2);
    }

    // editReferredUsers test
    function test_EditReferredUsers() public {
        call.callCreate(referralCode1);

        address user = vm.addr(3);
        vm.prank(user, user);
        call.callAddReferee(referralCode1);

        // assertEq users code to ref code 1
        assertEq(platformLogic.viewReferredUser(user), referralCode1);

        address factory = vm.addr(9);
        vm.prank(factory, factory);

        call.callEditReferredUsers(user, referralCode2);
        // assertEq users code to ref code 2
        assertEq(platformLogic.viewReferredUser(user), referralCode2);
    }

    // Factory edit referral users test
    /// @notice should revert when caller is not factory
    /// @dev implement this test when applying access control on the factory side
    function test_RevertWhen_UserEditIsNotCalledByFactory() public {
        call.callCreate(referralCode1);

        address user = vm.addr(3);
        vm.prank(user, user);
        call.callAddReferee(referralCode1);

        // assertEq users code to ref code 1
        assertEq(platformLogic.viewReferredUser(user), referralCode1);

        // no factory access control, not whitelisted address
        Call call2 = new Call(address(platformLogic));

        address notfactory = vm.addr(7);
        vm.prank(notfactory, notfactory);
        vm.expectRevert(NotAdmin.selector);

        call2.callEditReferredUsers(user, referralCode2);
    }

    // Factory add test
    function test_setFactory() public {
        address factory = vm.addr(9);
        vm.prank(factory, factory);

        address newFactory = vm.addr(4);
        call.callSetFactory(newFactory, true);

        // assertEq newFactory true
        //   vm.prank(factory, factory);
        //   assertEq(referral.checkFactory(newFactory), true);

        vm.prank(newFactory, newFactory);
        call.callSetFactory(factory, false);

        // assertEq factory false
        // assertEq(referral.checkFactory(factory), false);
    }

    // Set Factory Access Control Test
    // revert when not factory tries to invoke this function
    /// @dev remember to properly add Access Control to the Factory side
    function test_RevertWhen_SetFactoryIsNotCalledByFactory() public {
        address factory = vm.addr(9);
        vm.prank(factory, factory);

        address newFactory = vm.addr(4);
        call.callSetFactory(newFactory, true);

        // no factory access control, not whitelisted address
        Call call2 = new Call(address(platformLogic));

        vm.prank(newFactory, newFactory);
        vm.expectRevert(NotAdmin.selector);

        call2.callSetFactory(factory, false);
    }
}
