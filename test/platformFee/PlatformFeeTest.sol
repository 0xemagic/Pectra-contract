// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "forge-std/Test.sol";
import "../../src/PlatformLogic/Call.sol";
import "../../src/PlatformLogic/PlatformLogic.sol";
import "../../src/PlatformLogic/IPlatformLogic.sol";
import "../../src/Mock/MockErc20.sol";
import "../../src/Mock/RefuseEther.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "forge-std/console.sol";

contract PlatformFeeTest is Test {
    PlatformLogic platformLogic;
    MockErc20 erc20;
    RefuseEther refuseEther;

    string name = "mocktoken";
    string symbol = "mock";

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

    function ReferralSetup(
        address _referrer,
        address _referee,
        bytes32 _code
    ) public {
        vm.prank(_referrer, _referrer);

        call.callCreate(_code);

        vm.prank(_referee, _referee);

        call.callAddReferee(_code);

        assertEq(platformLogic.viewReferredUser(_referee), _code);
    }

    function setUp() public {
        erc20 = new MockErc20(name, symbol);

        platformLogic = new PlatformLogic(
            factory,
            payable(treasury),
            payable(staking)
        );
        refuseEther = new RefuseEther(address(platformLogic));

        call = new Call(address(platformLogic));

        vm.prank(factory, factory);

        platformLogic.setFactory(address(call), true);

        ReferralSetup(referrer, referee, referralCode1);
    }

    function test_CalculateFees() public {
        uint256 grossAmount = 1 ether;

        uint256 feeAmount = platformLogic.calculateFees(grossAmount, 500);

        assertEq(feeAmount, 50000000000000000);
    }

    function test_CalculateFeesWithSmallValue() public {
        uint256 grossAmount = 0.00005 ether;

        uint256 feeAmount = platformLogic.calculateFees(grossAmount, 500);

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

        assertEq(treasuryFeeSplit + stakersFeeSplit, feeAmount);

        vm.prank(addr, addr);
        call.callApplyPlatformFeeEth{value: feeAmount}(addr, grossAmount);

        assertEq(treasury.balance, treasuryFeeSplit);
        assertEq(staking.balance, stakersFeeSplit);
    }

    function ApplyPlatformFeeEthWithSmallValue(
        address _referee,
        address _referrer,
        bytes32 _code
    ) public {
        uint256 grossAmount = 0.05 ether;

        vm.deal(_referee, 1.5 ether);

        uint256 feeAmount = platformLogic.calculateFees(
            grossAmount,
            platformLogic.platformFee()
        );

        // assert user is referred with referral code
        assertEq(platformLogic.viewReferredUser(_referee), _code);

        vm.prank(_referee, _referee);

        call.callApplyPlatformFeeEth{value: feeAmount}(_referee, grossAmount);

        // calculate the fees

        uint256 _refereeDiscount = platformLogic.calculateFees(
            feeAmount,
            platformLogic.refereeDiscount()
        );

        uint256 _referrerWithdrawal = platformLogic.calculateFees(
            feeAmount,
            platformLogic.referrerFee()
        );

        uint256 _feeAmount = feeAmount;
        _feeAmount -= (_refereeDiscount + _referrerWithdrawal);

        assertEq(
            platformLogic.pendingEthWithdrawals(_referrer),
            _referrerWithdrawal
        );

        assertEq(_feeAmount, treasury.balance + staking.balance);
    }

    function test_ApplyPlatformFeeEthWithSmallValue() public {
        ApplyPlatformFeeEthWithSmallValue(referee, referrer, referralCode1);
        assertEq(platformLogic.checkReferredUser(referee), referrer);

        // assertEq(referee.balance, referee.balance - (feeAmount));
    }

    // withdaw eth fee tests
    function test_WithdrawEthFees() public {
        test_ApplyPlatformFeeEthWithSmallValue();

        uint256 grossAmount = 0.05 ether;

        uint256 feeAmount = platformLogic.calculateFees(
            grossAmount,
            platformLogic.platformFee()
        );

        uint256 _referrerWithdrawal = platformLogic.calculateFees(
            feeAmount,
            platformLogic.referrerFee()
        );

        assertEq(
            platformLogic.pendingEthWithdrawals(referrer),
            _referrerWithdrawal
        );

        uint256 referrerBalanceBefore = referrer.balance;

        vm.prank(referrer, referrer);

        uint256 referrerFee = platformLogic.pendingEthWithdrawals(referrer);

        vm.prank(referrer, referrer);

        platformLogic.withdrawEthFees();
    }

    function test_RevertWhenBalanceIsNotEnough_WithdrawEthFees() public {
        test_ApplyPlatformFeeEthWithSmallValue();

        vm.expectRevert(NotEnoughBalance.selector);
        // reverts cause this caller (call contract) does not have enough balance
        call.callWithdrawEthFees();
    }

    function test_RevertWhenCannotSendValue_WithdrawEthFees() public {
        // setup refuseEther with random referee
        address _referee = vm.addr(6);
        ReferralSetup(address(refuseEther), _referee, referralCode2);

        ApplyPlatformFeeEthWithSmallValue(
            _referee,
            address(refuseEther),
            referralCode2
        );

        vm.expectRevert(TransactionFailed.selector);
        refuseEther.callWithdrawEthFees();
    }

    // Apply ERC20 Tests
    function setupErc20Tokens(
        address allowerAddress,
        uint256 _tokenAmount
    ) public {
        // should mint to address for allowance
        /// @dev spender = referee

        erc20.mint(allowerAddress, _tokenAmount);

        vm.prank(allowerAddress, allowerAddress);

        // make sure contract is approved to spend
        erc20.approve(address(platformLogic), _tokenAmount);

        uint256 allowanceAmount = erc20.allowance(
            allowerAddress,
            address(platformLogic)
        );

        assertEq(allowanceAmount, _tokenAmount);
    }

    function ApplyPlatformFeeErc20(
        address _referee,
        address _referrer,
        bytes32 _code,
        uint256 _grossAmount
    ) public {
        uint256 grossAmount = _grossAmount;
        // can be random address so it does not enter the referral logic (not referred)
        setupErc20Tokens(_referee, grossAmount);

        uint256 feeAmount = platformLogic.calculateFees(
            grossAmount,
            platformLogic.platformFee()
        );

        assertEq(platformLogic.viewReferredUser(_referee), _code);
        assertEq(platformLogic.checkReferredUser(_referee), _referrer);

        uint256 allowanceAmount = erc20.allowance(
            _referee,
            address(platformLogic)
        );

        assertEq(allowanceAmount, 1000);

        // transaction money
        vm.deal(_referee, 1 ether);

        vm.prank(_referee, _referee);

        // send the tokens
        call.callApplyPlatformFeeErc20(_referee, grossAmount, erc20);

        uint256 _refereeDiscount = platformLogic.calculateFees(
            feeAmount,
            platformLogic.refereeDiscount()
        );

        uint256 _referrerWithdrawal = platformLogic.calculateFees(
            feeAmount,
            platformLogic.referrerFee()
        );

        feeAmount -= (_refereeDiscount + _referrerWithdrawal);

        uint256 _amountToBeSendToTreasury = platformLogic.calculateFees(
            feeAmount,
            platformLogic.treasuryFeeSplit()
        );

        uint256 _amountToBeSendToStakers = feeAmount -
            _amountToBeSendToTreasury;

        // uint256 _amountToBeSendToStakers = platformLogic.calculateFees(
        //     feeAmount,
        //     platformLogic.stakersFeeSplit()
        // );

        assertEq(erc20.balanceOf(treasury), _amountToBeSendToTreasury);
        assertEq(erc20.balanceOf(staking), _amountToBeSendToStakers);

        assertEq(
            platformLogic.checkPendingTokenWithdrawals(_referrer, erc20),
            _referrerWithdrawal
        );
    }

    function test_ApplyPlatformFeeErc20WithoutRefereeLogic() public {
        uint256 grossAmount = 1000;

        address addr = vm.addr(6);

        // random address so it does not enter the referral logic (not referred)
        setupErc20Tokens(addr, grossAmount);

        bytes32 ZERO_VALUE = 0x0000000000000000000000000000000000000000000000000000000000000000;

        uint256 feeAmount = platformLogic.calculateFees(
            grossAmount,
            platformLogic.platformFee()
        );

        // ensure logic does not enter referral discounts
        assertEq(platformLogic.viewReferredUser(addr), ZERO_VALUE);

        uint256 allowanceAmount = erc20.allowance(addr, address(platformLogic));

        assertEq(allowanceAmount, 1000);

        // transaction money
        vm.deal(addr, 1 ether);

        vm.prank(addr, addr);

        call.callApplyPlatformFeeErc20(addr, grossAmount, erc20);

        uint256 _amountToBeSendToTreasury = platformLogic.calculateFees(
            feeAmount,
            platformLogic.treasuryFeeSplit()
        );

        uint256 _amountToBeSendToStakers = platformLogic.calculateFees(
            feeAmount,
            platformLogic.stakersFeeSplit()
        );

        assertEq(erc20.balanceOf(treasury), _amountToBeSendToTreasury);
        assertEq(erc20.balanceOf(staking), _amountToBeSendToStakers);
    }

    function test_ApplyPlatformFeeErc20() public {
        ApplyPlatformFeeErc20(referee, referrer, referralCode1, 1000);
        assertEq(platformLogic.checkReferredUser(referee), referrer);
    }

    function test_RevertWhen_ValueExceedsAllowanceErc20() public {
        vm.expectRevert(ExceedsAllowance.selector);

        call.callApplyPlatformFeeErc20(referee, 10, erc20);
    }

    // make this for the 4 calls _successStakers, _successTreasury
    function test_RevertWhen_CannotSendToStakers() public {}

    function test_WithdrawTokenFees() public {
        uint256 grossAmount = 1000;

        ApplyPlatformFeeErc20(referee, referrer, referralCode1, grossAmount);

        erc20.mint(address(platformLogic), 15);

        uint256 feeAmount = platformLogic.calculateFees(
            grossAmount,
            platformLogic.platformFee()
        );

        uint256 _referrerWithdrawal = platformLogic.calculateFees(
            feeAmount,
            platformLogic.referrerFee()
        );

        assertEq(
            platformLogic.checkPendingTokenWithdrawals(referrer, IERC20(erc20)),
            _referrerWithdrawal
        );

        vm.prank(referrer, referrer);

        platformLogic.withdrawTokenFees(erc20);

        assertEq(erc20.balanceOf(referrer), _referrerWithdrawal);
    }

    function test_ViewFunctions() public {
        test_ApplyPlatformFeeEthWithSmallValue();
        test_ApplyPlatformFeeErc20();
        vm.prank(factory, factory);
        bool statement = platformLogic.checkFactory(factory);

        uint256 viewPlatformFee = platformLogic.viewPlatformFee();
        assertEq(platformLogic.platformFee(), viewPlatformFee);

        uint256 viewRefereeDiscount = platformLogic.viewRefereeDiscount();
        assertEq(platformLogic.refereeDiscount(), viewRefereeDiscount);

        uint256 viewReferrerFee = platformLogic.viewReferrerFee();
        assertEq(platformLogic.referrerFee(), viewReferrerFee);
    }

    function test_changePectraTreasury() public {
        address addr = vm.addr(6);
        vm.prank(factory, factory);
        platformLogic.changePectraTreasury(payable(addr));

        assertEq(platformLogic.PectraTreasury(), payable(addr));
    }

    function test_changePectraStakingContract() public {
        address addr = vm.addr(6);
        vm.prank(factory, factory);
        platformLogic.changePectraStakingContract(payable(addr));

        assertEq(platformLogic.PectraStakingContract(), payable(addr));
    }

    function test_setTreasuryFeeSplit() public {
        uint256 _treasuryFeeSplit = 1000;
        vm.prank(factory, factory);
        platformLogic.setTreasuryFeeSplit(_treasuryFeeSplit);

        assertEq(platformLogic.treasuryFeeSplit(), _treasuryFeeSplit);
    }

    function test_setStakersFeeSplit() public {
        uint256 stakersFeeSplit = 1000;
        vm.prank(factory, factory);
        platformLogic.setStakersFeeSplit(stakersFeeSplit);

        assertEq(platformLogic.stakersFeeSplit(), stakersFeeSplit);
    }

    function test_setPlatformFee() public {
        uint256 _platformFee = 1000;
        vm.prank(factory, factory);
        platformLogic.setPlatformFee(_platformFee);

        assertEq(platformLogic.platformFee(), _platformFee);
    }

    function test_setReferrerFee() public {
        uint256 _platformFee = 1000;
        vm.prank(factory, factory);
        platformLogic.setReferrerFee(_platformFee);

        assertEq(platformLogic.referrerFee(), _platformFee);
    }

    function test_setRefereeDiscount() public {
        uint256 _platformFee = 1000;
        vm.prank(factory, factory);
        platformLogic.setRefereeDiscount(_platformFee);

        assertEq(platformLogic.refereeDiscount(), _platformFee);
    }

    // tests with onlyFactory modifier

    // tests with notZeroAddress modifier
}
