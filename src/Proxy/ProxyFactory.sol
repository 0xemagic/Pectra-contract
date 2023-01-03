// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {PectraImplementation} from "./PectraImplementation.sol";

contract ProxyFactory {
    address public currentImplementation;
    mapping(address => address) public proxyControllers;

    constructor(address _implementation) {
        currentImplementation = _implementation;
    }

    function deployProxy(uint256 number) public returns (address) {
        ERC1967Proxy proxy = new ERC1967Proxy(currentImplementation, "");
        PectraImplementation instance = PectraImplementation(address(proxy));
        instance.initialize(number, msg.sender);
        proxyControllers[address(proxy)] = msg.sender;
        return address(proxy);
    }
}
