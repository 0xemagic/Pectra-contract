// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "forge-std/Test.sol";
import "../../src/PlatformLogic/Call.sol";
import "../../src/PlatformLogic/PlatformLogic.sol";
import "../../src/PlatformLogic/IPlatformLogic.sol";
import "forge-std/console.sol";

contract PlatformFeeTest is Test {
    PlatformLogic platformLogic;

    // Call is a mock caller pretenting to be GMX Adapter or Factory
    Call call;

    // random referral code
    bytes32 referralCode1 = "asd";

    // another random referral code
    bytes32 referralCode2 = "asdf";

    // referrer
    address referrer = vm.addr(1);

    // referee
    address referee = vm.addr(2);
    address factory = vm.addr(3);
    address payable treasury = payable(vm.addr(4));
    address payable staking = payable(vm.addr(5));

    function setUp() public {
        platformLogic = new PlatformLogic(
            factory,
            payable(treasury),
            payable(staking)
        );

        call = new Call(address(platformLogic));

        vm.prank(factory, factory);

        platformLogic.setFactory(address(call), true);

        // CreateReferralCode && AddReferee

        vm.prank(referrer, referrer);

        call.callCreate(referralCode1);

        vm.prank(referee, referee);

        call.callAddReferee(referralCode1);

        assertEq(platformLogic.viewReferredUser(referee), referralCode1);
    }

    function test_CalculateFees() public {
        uint256 grossAmount = 1 ether;

        uint256 feeAmount = platformLogic.calculateFees(grossAmount, 500);

        // console.log(feeAmount);

        assertEq(feeAmount, 50000000000000000);
    }

    function test_CalculateFeesWithSmallValue() public {
        uint256 grossAmount = 0.00005 ether;

        uint256 feeAmount = platformLogic.calculateFees(grossAmount, 500);

        // console.log(feeAmount);

        assertEq(feeAmount, 2500000000000);
    }

    // Apply ETH Fees Tests
    function test_ApplyPlatformFeeEthWithoutRefereeLogic() public {
        uint256 grossAmount = 1 ether;

        address addr = vm.addr(6);
        vm.deal(addr, 1.5 ether);

        bytes32 ZERO_VALUE = 0x0000000000000000000000000000000000000000000000000000000000000000;

        uint256 feeAmount = platformLogic.calculateFees(
            grossAmount,
            platformLogic.platformFee()
        );

        console.log("feeAmount", feeAmount);

        // ensure logic does not enter referral discounts
        assertEq(platformLogic.viewReferredUser(addr), ZERO_VALUE);

        uint256 treasuryFeeSplit = platformLogic.calculateFees(
            feeAmount,
            platformLogic.treasuryFeeSplit()
        );

        uint256 stakersFeeSplit = platformLogic.calculateFees(
            feeAmount,
            platformLogic.stakersFeeSplit()
        );

        // // console.log("feeAmount", feeAmount);
        // // console.log("treasuryFeeSplit", treasuryFeeSplit);
        // // console.log("stakersFeeSplit", stakersFeeSplit);
        // console.log(
        //     "treasuryFeeSplit + stakersFeeSplit",
        //     treasuryFeeSplit + stakersFeeSplit
        // );

        // console.log("Treasury Addr", treasury);

        assertEq(treasuryFeeSplit + stakersFeeSplit, feeAmount);

        call.callApplyPlatformFeeEth{value: feeAmount}(addr, grossAmount);

        assertEq(treasury.balance, treasuryFeeSplit);
        assertEq(staking.balance, stakersFeeSplit);

        // assertEq(addr.balance, addr.balance - (feeAmount));
    }

    // function test_ApplyPlatformFeeEthWithSmallValue() public {
    //     uint256 grossAmount = 1 ether;

    //     call.callApplyPlatformFeeEth(referee, grossAmount);
    // }

    // // Apply ERC20 Tests
    // function test_ApplyPlatformFeeErc20() public {
    //     // call.callApplyPlatformFeeErc20();
    // }

    // //
    // function test_WithdrawEthFees() public {
    //     call.callWithdrawEthFees();
    // }

    // //
    // function test_WithdrawTokenFees() public {
    //     call.callWithdrawTokenFees();
    // }
}
