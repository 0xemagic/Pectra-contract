// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import {PectraImplementation} from "../src/Proxy/PectraImplementation.sol";
import {ProxyFactory} from "../src/Proxy/ProxyFactory.sol";

contract ProxyTest is Test {
    PectraImplementation public implementation;
    ProxyFactory public factory;

    address public alice = address(0xa);

    function setUp() public {
        vm.label(address(this), "tester");
        vm.label(alice, "alice");
        implementation = new PectraImplementation();
        vm.label(address(implementation), "implementation");
        factory = new ProxyFactory(address(implementation));
        vm.label(address(factory), "factory");
    }

    function testImplementationInitializersDisabled() public {
        vm.expectRevert();
        implementation.initialize(0, address(0));
    }

    function testFactoryDeployProxy(uint256 _number) public {
        vm.prank(alice);
        address proxyAddress = factory.deployProxy(_number);
        assertEq(
            PectraImplementation(proxyAddress).number(),
            _number,
            "number should be equal"
        );
        assertEq(
            implementation.number(),
            0,
            "implementation should not change"
        );
        assertEq(
            PectraImplementation(proxyAddress).creator(),
            alice,
            "creator should be equal"
        );
        assertEq(
            implementation.creator(),
            address(0),
            "implementation should not change"
        );
    }
}
