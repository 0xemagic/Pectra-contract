// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

error CanOnlyAddYourself();
error Unavailable();
error NotAdmin();

contract Referral {
    bytes32 constant ZERO_VALUE =
        0x0000000000000000000000000000000000000000000000000000000000000000;

    event ReferralCodeAdded(address indexed referrer, bytes32 code);
    event RefereeAdded(address indexed referee, bytes32 code);
    event FactorySet(address factory);

    /// @notice store the Factory Addresses
    mapping(address => bool) private factories;

    /// @notice storing the referral codes
    mapping(bytes32 => address) public referralCodes;

    /// @notice mapping to store the Refferal codes to user's addresses(creator of referral codes)
    mapping(address => bytes32) public referrers;

    /// @notice mapping to store the Reffered users to referral codes(users being referred)
    mapping(address => bytes32) public referredUsers;

    modifier onlyFactory() {
        if (factories[msg.sender] != true) revert NotAdmin();
        _;
    }

    /// @param _factory the initial Factory address
    constructor(address _factory) {
        factories[_factory] = true;
    }

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

    // function should implement logic to give % of the fees to referrers,
    // should be invoked by users and passed the code of the referrer
    // then % of the fees of the transaction should be added to a mapping that stores the withdrawing
    // fee possibilities
    function implementReferralCode(bytes32 _referralCode) external {
        if (referralCodes[_referralCode] == address(0x0)) revert Unavailable();
        // logic to give % fee to referrer
    }

    //
    function implementReferrerCode(bytes32 _referralCode) external {
        // logic to give % fee discount to user
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
    // function to store the royalty %

    // should this contract manage royalty logic? - consider tier implementation
}
