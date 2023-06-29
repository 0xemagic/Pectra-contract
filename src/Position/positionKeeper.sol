// SPDX-License-Identifier: MIT
import "./IPositionRouter.sol";

pragma solidity ^0.6.0;

contract PositionKeeper {
    address public PositionRouter;
    address public owner;

    constructor(address _positionRouter) public {
        PositionRouter = _positionRouter;
        owner = msg.sender;
    }    
    
    function execute() external {
        IPositionRouter positionRouter = IPositionRouter(PositionRouter);
        (, uint256 _maxIncreasePositions, , uint256 _maxDecreasePositions) = positionRouter.getRequestQueueLengths(); 

        positionRouter.executeIncreasePositions(_maxIncreasePositions, payable(owner));
        positionRouter.executeDecreasePositions(_maxDecreasePositions, payable(owner));
    }
}