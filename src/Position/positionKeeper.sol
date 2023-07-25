// SPDX-License-Identifier: MIT
import "./IPositionRouter.sol";

pragma solidity ^0.6.0;

contract PositionKeeper {
    // Contract variables
    address public PositionRouter;
    address public owner;

    /**
     * @dev Constructor to initialize the PositionKeeper contract.
     *
     * @param _positionRouter The address of the GMX Position Router contract.
     */
    constructor(address _positionRouter) public {
        PositionRouter = _positionRouter;
        owner = msg.sender;
    }    
    
    /**
     * @dev Execute the increase and decrease positions in the GMX Position Router.
     *
     * This function retrieves the maximum number of increase and decrease positions to be executed
     * and calls the corresponding functions in the GMX Position Router to execute the positions.
     * The execution is done by the contract owner.
     */
    function execute() external {
        IPositionRouter positionRouter = IPositionRouter(PositionRouter);
        (, uint256 _maxIncreasePositions, , uint256 _maxDecreasePositions) = positionRouter.getRequestQueueLengths(); 

        // Execute the increase positions with the owner address as the recipient of funds.
        positionRouter.executeIncreasePositions(_maxIncreasePositions, payable(owner));

        // Execute the decrease positions with the owner address as the recipient of funds.
        positionRouter.executeDecreasePositions(_maxDecreasePositions, payable(owner));
    }
}
