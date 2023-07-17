// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IRouter {
    function approvePlugin(address _plugin) external;

    function vault() external returns (address);
}
