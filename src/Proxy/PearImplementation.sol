// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";
import {LogicImplementation} from "./LogicImplementation.sol";

contract PectraImplementation is
    LogicImplementation,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    constructor() {
        _disableInitializers();
    }

    // @dev required for UUPSUpgradeable
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize(uint256 _number, address _creator) public initializer {
        number = _number;
        creator = _creator;
        __Ownable_init();
    }

    function getController() public view returns (address) {
        return owner();
    }
}
