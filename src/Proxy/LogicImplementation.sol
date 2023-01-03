// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract LogicImplementation {
    uint256 public number;
    address public creator;

    function decrement() public {
        require(number > 0, "LogicImplementation: number is zero");
        number--;
    }
}
