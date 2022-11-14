// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.2;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract VRFConsumer is VRFConsumerBaseV2, ConfirmedOwner, ReentrancyGuard {
    using SafeERC20 for IERC20;

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    enum LotteryStatus {
        Open,
        Close
    }
    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    //fee recipient address
    address public feeRecipient;
    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    bytes32 keyHash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 200000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 2;

    //Lotery member
    address[] public members;
    uint256 public currentRequestID;
    address public router;
    address public LINK;
    LotteryStatus status = LotteryStatus.Close;

    /**
     * HARDCODED FOR BNB TESTNET
     * COORDINATOR: 0x6A2AAd07396B36Fe02a22b33cf443582f682c82f
     */
    constructor(
        address _vrfCoordinator,
        address _link,
        uint64 _subscriptionId,
        address _feeRecipient,
        address _router
    ) VRFConsumerBaseV2(_vrfCoordinator) ConfirmedOwner(msg.sender) {
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        s_subscriptionId = _subscriptionId;
        feeRecipient = _feeRecipient;
        LINK = _link;
        router = _router;
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() internal returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        uint256 lotteryFee = (address(this).balance * 100) / 1000;
        payable(feeRecipient).transfer(lotteryFee);
        uint256 winnerID = s_requests[_requestId].randomWords[0] % 5;
        (bool successWinner, ) = payable(members[winnerID]).call{
            value: address(this).balance
        }("");
        delete members;
        status = LotteryStatus.Close;
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function entryLottery() external payable nonReentrant {
        require(msg.value == 0.1 ether, "entry fee should be 0.1 Ether");
        require(members.length < 5, "lottery is not started yet");
        members.push(msg.sender);
        if (members.length == 5) {
            payable(msg.sender).transfer(0.002 ether);
            address[] memory path;
            path = new address[](2);
            path[0] = IUniswapRouter(router).WETH();
            path[1] = LINK;
            IUniswapRouter(router).swapETHForExactTokens{value: 0.1 ether}(
                5e15,
                path,
                address(this),
                block.timestamp
            );

            currentRequestID = requestRandomWords();
            status = LotteryStatus.Open;
        }
    }

    fallback() external payable {}
}

interface IUniswapRouter {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);
}
