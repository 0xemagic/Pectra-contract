// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
import "../GMX/interfaces/IRouter.sol";
import "../GMX/interfaces/IPositionRouter.sol";

contract GMXAdapter {

    address public ROUTER;
    address public POSITION_ROUTER;

    constructor(address _router, address _positionRouter) {
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;
    }

    function approve(address token, address spender, uint256 amount) external returns (bool) {
        return IERC20(token).approve(spender, amount);
    }
}