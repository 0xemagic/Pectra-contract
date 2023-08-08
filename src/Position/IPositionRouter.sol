// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

/**
 * @dev Interface of the Position Router contract of GMX.
 */
interface IPositionRouter {
    /**
     * @dev Get the start position of the increase position request keys.
     *
     * @return _start The start position of the increase position request keys.
     */
    function increasePositionRequestKeysStart() external returns (uint256);

    /**
     * @dev Get the start position of the decrease position request keys.
     *
     * @return _start The start position of the decrease position request keys.
     */
    function decreasePositionRequestKeysStart() external returns (uint256);

    /**
     * @dev Execute the specified number of increase positions.
     *
     * @param _count The number of increase positions to execute.
     * @param _executionFeeReceiver The address that will receive the execution fees for the increase positions.
     */
    function executeIncreasePositions(
        uint256 _count,
        address payable _executionFeeReceiver
    ) external;

    /**
     * @dev Execute the specified number of decrease positions.
     *
     * @param _count The number of decrease positions to execute.
     * @param _executionFeeReceiver The address that will receive the execution fees for the decrease positions.
     */
    function executeDecreasePositions(
        uint256 _count,
        address payable _executionFeeReceiver
    ) external;

    /**
     * @dev Get the lengths of various request queues in the Position Router.
     *
     * @return _increaseStart The start position of the increase position request keys.
     * @return _maxIncreasePositions The maximum number of increase positions in the request queue.
     * @return _decreaseStart The start position of the decrease position request keys.
     * @return _maxDecreasePositions The maximum number of decrease positions in the request queue.
     */
    function getRequestQueueLengths()
        external
        view
        returns (
            uint256 _increaseStart,
            uint256 _maxIncreasePositions,
            uint256 _decreaseStart,
            uint256 _maxDecreasePositions
        );
}
