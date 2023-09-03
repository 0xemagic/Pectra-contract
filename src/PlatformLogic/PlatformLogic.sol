// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error CanOnlyAddYourself();
error Unavailable();
error NotAdmin();
error WrongFeeAmount();
error GivenZeroAddress();
error TransactionFailed();
error ExceedsAllowance();
error WrongValueSent();
error NotEnoughBalance();
/// @dev is this event necessary?
error ReferrerAmountExceedsFeeAmount();

contract PlatformLogic is ReentrancyGuard {
    bytes32 constant ZERO_VALUE =
        0x0000000000000000000000000000000000000000000000000000000000000000;

    /// @notice 10000 = 100%, so platform fee is 500 = 5%
    uint256 public platformFee = 500;

    // caclculate how much is it possible to be devided by ex. 10000 = 100% probably will be little
    /// @notice this is a percantage of the platformFee
    /// @dev 5% = 500
    /// @dev has a setter, consider view function
    uint256 public referrerFee = 500;

    /// @notice this is a percantage of the platformFee
    /// @dev 10% = 1000
    /// @dev has a setter, consider view function
    uint256 public refereeDiscount = 1000;

    /// @notice part of the fees(after referrers) that need to be send to Pectra Treasury
    /// @dev 8000 = 80%
    /// @dev has a setter, consider view function
    uint256 public treasuryFeeSplit = 8000;

    /// @notice part of the fees(after referrers) that need to be send to Pectra Staking
    /// @dev 2000 = 20%
    /// @dev not used atm cause the _splitBetweenStakersAndTreasury just - the leftover from the fee amount
    uint256 public stakersFeeSplit = 2000;

    address payable public PectraTreasury;

    address payable public PectraStakingContract;

    /// @notice store the Factory Addresses
    mapping(address => bool) private factories;

    /// @notice storing the referral codes
    mapping(bytes32 => address) public referralCodes;

    /// @notice mapping to store the Refferal codes to user's addresses(creator of referral codes)
    mapping(address => bytes32) public referrers;

    /// @notice mapping to store the Reffered users to referral codes(users being referred)
    mapping(address => bytes32) public referredUsers;

    /// @notice mapping to store the pending withdrawals user address to amount
    mapping(address => uint256) public pendingEthWithdrawals;

    // address referrer => tokenAddress => amount
    mapping(address => mapping(IERC20 => uint256)) pendingTokenWithdrawals;

    event PlatformFeeChanged(uint256 oldPlatformFee, uint256 newPlatformFee);
    event RefereeDiscountChanged(
        uint256 oldRefereeDiscount,
        uint256 newRefereeDiscount
    );
    event ReferrerFeeChanged(
        uint256 oldReferrerFeeChanged,
        uint256 newReferrerFeeChanged
    );

    event PectraTreasuryChanged(address oldTreasury, address newTreasury);
    event PectraStakingContractChanged(
        address oldPectraStakingContract,
        address newPectraStakingContract
    );

    event StakersFeeSplit(uint256 oldStakersFee, uint256 newStakersFeeSplit);
    event TreasuryFeeSplitChanged(
        uint256 oldTreasuryFee,
        uint256 newTreasuryFee
    );

    event ReferralCodeAdded(address indexed referrer, bytes32 code);
    event RefereeAdded(address indexed referee, bytes32 code);

    event FactorySet(address factory);

    event PendingWithdrawal(uint256 amount);
    event Withdraw(address withdrawer, uint256 amount);

    modifier onlyFactory() {
        if (factories[msg.sender] != true) revert NotAdmin();
        _;
    }

    modifier notZeroAddress(address _address) {
        if (_address == address(0x0)) {
            revert GivenZeroAddress();
        }
        _;
    }

    /// @param _factory the initial Factory address
    constructor(
        address _factory,
        address payable _PectraTreasury,
        address payable _PectraStakingContract
    ) {
        factories[_factory] = true;
        PectraTreasury = _PectraTreasury;
        PectraStakingContract = _PectraStakingContract;
    }

    ///******************************** */

    // remember to add a setter from the factory
    function setRefereeDiscount(uint256 _refereeDiscount) external onlyFactory {
        emit RefereeDiscountChanged(refereeDiscount, _refereeDiscount);
        refereeDiscount = _refereeDiscount;
    }

    // remember to add a setter from the factory
    function setReferrerFee(uint256 _referrerFee) external onlyFactory {
        emit ReferrerFeeChanged(referrerFee, _referrerFee);
        referrerFee = _referrerFee;
    }

    // set platformFee
    // remember to add a setPlatformFee function in the factory that calls to this one
    function setPlatformFee(uint256 _platformFee) external onlyFactory {
        emit PlatformFeeChanged(platformFee, _platformFee);
        platformFee = _platformFee;
    }

    function setTreasuryFeeSplit(
        uint256 _treasuryFeeSplit
    ) external onlyFactory {
        emit TreasuryFeeSplitChanged(treasuryFeeSplit, _treasuryFeeSplit);
        treasuryFeeSplit = _treasuryFeeSplit;
    }

    function setStakersFeeSplit(uint256 _stakersFeeSplit) external onlyFactory {
        emit StakersFeeSplit(stakersFeeSplit, _stakersFeeSplit);
        stakersFeeSplit = _stakersFeeSplit;
    }

    // remember to add a changePectraTreasury function in the factory that calls to this one
    function changePectraTreasury(
        address payable _newTreasury
    ) external onlyFactory {
        emit PectraTreasuryChanged(PectraTreasury, _newTreasury);
        PectraTreasury = _newTreasury;
    }

    // remember to add a changePectraStakingContract function in the factory that calls to this one
    function changePectraStakingContract(
        address payable _newStakingContract
    ) external onlyFactory {
        emit PectraStakingContractChanged(
            PectraStakingContract,
            _newStakingContract
        );
        PectraStakingContract = _newStakingContract;
    }

    // get platformFee
    function viewPlatformFee() public view returns (uint256) {
        return platformFee;
    }

    function viewRefereeDiscount() public view returns (uint256) {
        return refereeDiscount;
    }

    function viewReferrerFee() public view returns (uint256) {
        return referrerFee;
    }

    // calculate/implement platformFee
    // function that adds calculates the platformFee amount when given a value

    // public pure function takes in amount of eth/erc20tokens and returns the fee needed to be paid

    // add this function before sending msg.value or transferFrom in the Adapters

    // pass in value, this value gets applied to the platform fee
    // takes in address of person(referee) and amount

    /// @dev this function is left public for testing, can be private once deployed on mainnet
    /// @notice takes amount and bps(1000 = 10%)
    function calculateFees(
        uint256 _amount,
        uint256 _bps
    ) public pure returns (uint256) {
        /// @notice Check that the amount multiplied by the Basis Points is greater than or equal to 10.000
        // This ensures that we're not running into the issue of values being rounded down to 0.
        if ((_amount * _bps) <= 10000) revert WrongFeeAmount();
        return (_amount * _bps) / 10000;
    }

    /// @dev funciton that adds the ETH fees available for withdrawal from the referrer
    function _addEthFeesForWithdrawal(
        address _referrer,
        uint256 _amount
    ) internal notZeroAddress(_referrer) {
        // some checks, like cannot be address 0 - can be made into a modifer and appied to the applyPlatformFee too
        // add  fees to pendingWithdrawal mapping referrer address to uint256 amount
        pendingEthWithdrawals[_referrer] += _amount;
        // emit event
        emit PendingWithdrawal(_amount);
    }

    /// @dev funciton that adds the Token fees available for withdrawal from the referrer
    /// @dev add a check for allowed tokens(token) - this mapping can be stored in the Factory with a public getter
    function _addTokenFeesForWithdrawal(
        address _referrer,
        uint256 _amount,
        IERC20 _token
    ) internal notZeroAddress(_referrer) {
        // add a withdrawTokenFee function
        pendingTokenWithdrawals[_referrer][_token] += _amount;
        emit PendingWithdrawal(_amount);
    }

    /// @notice lets user withdraw all the Eth fees that have been collected from refering
    /// @dev should be called from the frontend directly
    function withdrawEthFees() public nonReentrant {
        uint256 _balance = pendingEthWithdrawals[msg.sender];
        if (_balance == 0) revert NotEnoughBalance();
        (bool success, ) = payable(msg.sender).call{value: _balance}("");
        if (!success) revert TransactionFailed();
        pendingEthWithdrawals[msg.sender] = 0;
        emit Withdraw(msg.sender, _balance);
    }

    /// @notice lets user withdraw all the Token fees that have been collected from refering
    /// @dev should be called from the frontend directly
    /// @dev maybe the transferFromFunction should be on the Factory side for the platformLogic Transfers,
    // since the allowance is there for the usdc tokens?
    /// @dev add a modifier that checks the token address is whitelisted
    /// @dev minimum tokens for transfer are 2? Make sure there is a check for that probably too before hitting the transfer
    // read ERC20InsufficientBalance for more info
    function withdrawTokenFees(IERC20 _token) public nonReentrant {
        uint256 _balance = pendingTokenWithdrawals[msg.sender][_token];
        if (_balance == 0) revert NotEnoughBalance();
        bool success = _token.transfer(msg.sender, _balance);
        // bool success = _token.transferFrom(address(this), msg.sender, _balance);
        if (!success) revert TransactionFailed();
        pendingTokenWithdrawals[msg.sender][_token] = 0;
        emit Withdraw(msg.sender, _balance);
    }

    /// @dev splits amount between stakers and treasury, and make calls to stakers contract and spectra treasury with the amount given
    /// @dev amount in % are managed from treasuryFeeSplit variable
    function _splitBetweenStakersAndTreasuryEth(uint256 _amount) internal {
        // calculate % to be send to treasury
        uint256 _amountToBeSendToTreasury = calculateFees(
            _amount,
            treasuryFeeSplit
        );

        // send the amount to the Treasury
        (bool _successTreasury, ) = PectraTreasury.call{
            value: _amountToBeSendToTreasury
        }("");

        if (!_successTreasury) revert TransactionFailed();

        uint256 _amountToBeSendToStakers = _amount - _amountToBeSendToTreasury;
        // calculateFees(
        //     _amount,
        //     stakersFeeSplit
        // );

        (bool _successStakers, ) = PectraStakingContract.call{
            value: _amountToBeSendToStakers
        }("");

        if (!_successStakers) revert TransactionFailed();
    }

    /// @dev splits amount between stakers and treasury, and make calls to stakers contract and spectra treasury with the amount given
    /// @dev amount in % are managed from treasuryFeeSplit variable
    function _splitBetweenStakersAndTreasuryToken(
        address _referee,
        uint256 _amount,
        IERC20 _tokenAddress
    ) internal {
        // calculate % to be send to treasury
        uint256 _amountToBeSendToTreasury = calculateFees(
            _amount,
            treasuryFeeSplit
        );

        // send the amount to the Treasury
        bool _successTreasury = _tokenAddress.transferFrom(
            _referee,
            PectraTreasury,
            _amountToBeSendToTreasury
        );
        if (!_successTreasury) revert TransactionFailed();

        /// @dev why does this give 8 and the calculatefees approach 9 when given 1000 as token amount?
        uint256 _amountToBeSendToStakers = _amount - _amountToBeSendToTreasury;

        // calculate fees approach
        // uint256 _amountToBeSendToStakers = calculateFees(
        //     _amount,
        //     stakersFeeSplit
        // );

        // console.log(
        //     // _amount - _amountToBeSendToTreasury,
        //     _amountToBeSendToStakers
        // );

        bool _successStakers = _tokenAddress.transferFrom(
            _referee,
            PectraStakingContract,
            _amountToBeSendToStakers
        );

        if (!_successStakers) revert TransactionFailed();
    }

    /// @dev use the _erc20Payment to determite erc20 values and convert them if needed?
    /// @dev add a check if msg.value != _amount need to be spent revert
    function _applyPlatformFeeEth(
        address _referee,
        uint256 _grossAmount
    ) internal {
        // calculate the grossAmount -> if erc20Payment == true -> convertErc20ToFee, if not convertEthToFee
        // now we have the fee amount
        uint256 _feeAmount = calculateFees(_grossAmount, platformFee);

        if (msg.value != _feeAmount) revert WrongValueSent();
        // check referree (if user is referred) -> if true add 10% discount -> continue to the next check, if not skip to the end
        if (referredUsers[_referee] != ZERO_VALUE) {
            // calculate the referree discount %
            // for testing the refereeDiscount is set to 10 bps
            uint256 _refereeDiscount = calculateFees(
                _feeAmount,
                refereeDiscount
            );

            // calculate the referrer discount
            // for testing the referralFee is set to 5 bps
            uint256 _referrerWithdrawal = calculateFees(
                _feeAmount,
                referrerFee
            );

            /// @dev maybe add a check that _referrerWithdrawal + _refereeDiscount does not
            // get greater than _feeAmount
            if (_feeAmount <= (refereeDiscount + _referrerWithdrawal))
                revert ReferrerAmountExceedsFeeAmount();
            // remove the discounted % from the referee fees and referrer withdrawals
            // that have to be paid at the end
            /// @dev underflow check? test if needed
            _feeAmount -= (_refereeDiscount + _referrerWithdrawal);

            // next if check for referrer -> mapping if true (referrer exists) -> commision 5% to referrer (implement to withdraw)
            /// @notice adds the fees pending for withdrawal to the user that referred this user (referrer)

            _addEthFeesForWithdrawal(
                checkReferredUser(_referee),
                _referrerWithdrawal
            );
        }

        // the remaining amount is split 80/20 between stakers and spectra treasury
        _splitBetweenStakersAndTreasuryEth(_feeAmount);
    }

    /// @notice user needs to give allowance to the contract first so it can send the tokens
    // allowance to Factory, because it will call this
    /// @dev check if there should be access control for the _referee param
    // can users abuse this?
    function _applyPlatformFeeErc20(
        address _referee,
        uint256 _grossAmount,
        IERC20 _tokenAddress
    ) internal {
        // Returns the remaining number of tokens that spender
        // will be allowed to spend on behalf of owner through transferFrom.
        // This is zero by default.
        if (_tokenAddress.allowance(_referee, address(this)) < _grossAmount)
            revert ExceedsAllowance();

        // should check if the user is approved from the approved mapping if not revert
        // should check if the token is whitelisted to be used from Factory mapping?

        // can also call to check if the token is erc20 complient? - maybe not needed,
        // since they are already filtered through a mapping

        // shoould calculate the fees with the given amount from calculateFees

        uint256 _feeAmount = calculateFees(_grossAmount, platformFee);

        // check referree (if user is referred) -> if true add 10% discount -> continue to the next check, if not skip to the end
        if (referredUsers[_referee] != ZERO_VALUE) {
            // calculate the referree discount %
            // for testing the refereeDiscount is set to 10 bps
            uint256 _refereeDiscount = calculateFees(
                _feeAmount,
                refereeDiscount
            );

            // calculate the referrer discount
            // for testing the referralFee is set to 5 bps
            uint256 _referrerWithdrawal = calculateFees(
                _feeAmount,
                referrerFee
            );

            // remove the discounted % from the referee fees and referrer withdrawals
            // that have to be paid at the end
            /// @dev underflow check? test if needed
            _feeAmount -= (_refereeDiscount + _referrerWithdrawal);

            // next if check for referrer -> mapping if true (referrer exists) -> commision 5% to referrer (implement to withdraw)
            /// @notice adds the fees pending for withdrawal to the user that referred this user (referrer)
            _addTokenFeesForWithdrawal(
                checkReferredUser(_referee),
                _referrerWithdrawal,
                _tokenAddress
            );
        }
        // console.log("fee", _feeAmount);

        // should call transfer on the token
        // the remaining amount is split 80/20 between stakers and spectra treasury
        _splitBetweenStakersAndTreasuryToken(
            _referee,
            _feeAmount,
            _tokenAddress
        );
    }

    /// @dev add access control only from factory?
    function applyPlatformFeeEth(
        address _referee,
        uint256 _grossAmount
    ) external payable nonReentrant {
        _applyPlatformFeeEth(_referee, _grossAmount);
    }

    /// @dev add access control only from factory?
    function applyPlatformFeeErc20(
        address _referee,
        uint256 _grossAmount,
        IERC20 _tokenAddress
    ) external nonReentrant {
        // _tokenAddress.
        _applyPlatformFeeErc20(_referee, _grossAmount, _tokenAddress);
    }

    ///******************************** */

    /// @notice function to create referral codes, invoked when a user wants to get a code
    /// @dev should check if code is not used yet, should not allow a user to edit his referral code
    /// @notice function uses tx.origin, this way the EOA that invoked the transaction from the Adapter
    // will be recorded, another more complex approach that we can use is by utilising allowances
    function createReferralCode(bytes32 _referralCode) external returns (bool) {
        /// @dev ensure that the referral code is not used yet
        // check that address can be only one
        if (
            referrers[tx.origin] != ZERO_VALUE ||
            referralCodes[_referralCode] != address(0x0)
        ) revert Unavailable();
        // write the EOA's referral code
        referrers[tx.origin] = _referralCode;
        // write the referral code
        referralCodes[_referralCode] = tx.origin;
        emit ReferralCodeAdded(tx.origin, _referralCode);
        return true;
    }

    // function to add to the referredUsers mapping
    /// @notice function is invoked when a user adds another users referral code (is referred)
    function addReferee(bytes32 _referralCode) external returns (bool) {
        /// @dev ensure that the referee has not assigned code is not used yet
        // check to ensure the code is valid / exists
        // check that user is not adding himself as referee
        if (
            referredUsers[tx.origin] != ZERO_VALUE ||
            referralCodes[_referralCode] == address(0x0) ||
            referrers[tx.origin] == _referralCode
        ) revert Unavailable();
        // save referee and code relation
        referredUsers[tx.origin] = _referralCode;
        // index the event
        emit RefereeAdded(tx.origin, _referralCode);
        return true;
    }

    /// @dev function that allows factories to to edit the codes
    // remember to implement admin rights on the factory side as well, should not be accesible by everyone
    function editReferralCode(
        address _referrer,
        bytes32 _referralCode
    ) external onlyFactory {
        // write the address's referral code
        referrers[_referrer] = _referralCode;
        // write the referral code
        referralCodes[_referralCode] = _referrer;
        // emit event for indexing
        emit ReferralCodeAdded(_referrer, _referralCode);
    }

    /// @dev function that allows factories to to edit the referees
    // remember to implement admin rights on the factory side as well, should not be accesible by everyone
    function editReferredUsers(
        address _referrer,
        bytes32 _referralCode
    ) external onlyFactory {
        // write the address's referral code
        referredUsers[_referrer] = _referralCode;
        // emit event for indexing
        emit RefereeAdded(_referrer, _referralCode);
    }

    /// @notice function to add or remove factories
    /// @dev this is implemented because we can have more than 1 factory (ex. GMXFactory, VertexFactory..)
    function setFactory(address _factory, bool _state) external onlyFactory {
        // consider adding a check that a factory cannot remove itself
        factories[_factory] = _state;
        emit FactorySet(_factory);
    }

    /// @notice checks the referralCode's owner
    function viewReferralCodeOwner(
        bytes32 _referralCode
    ) external view returns (address codeOwner) {
        return referralCodes[_referralCode];
    }

    /// @notice checks the referrer's referralCode (code owner)
    function viewReferrersCode(
        address _referrer
    ) public view returns (bytes32 code) {
        return referrers[_referrer];
    }

    /// @notice returns the referred user's referral code (code that referred the user)
    function viewReferredUser(
        address _referredUser
    ) public view returns (bytes32 code) {
        return referredUsers[_referredUser];
    }

    /// @notice checks who referred the given user
    function checkReferredUser(
        address _referredUser
    ) public view returns (address referrer) {
        bytes32 _code = referredUsers[_referredUser];
        // returns the referral code owner
        return referralCodes[_code];
    }

    function checkFactory(
        address _factory
    ) public view onlyFactory returns (bool) {
        return factories[_factory];
    }

    function checkPendingTokenWithdrawals(
        address _referrer,
        IERC20 _token
    ) public view returns (uint256) {
        return pendingTokenWithdrawals[_referrer][_token];
    }
    // function to store the royalty %

    // should this contract manage royalty logic? - consider tier implementation
}
