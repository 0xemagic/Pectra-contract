// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";
import {LogicImplementation} from "./LogicImplementation.sol";

import "../GMX/interfaces.sol";
import "../GMX/library.sol";

contract PectraImplementation is
    LogicImplementation,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    address public WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    IPositionRouter public positionRouter = IPositionRouter(GMX.positionRouter);
    IRouter public router = IRouter(GMX.router);

    constructor() {
        _disableInitializers();
    }

    // @dev required for UUPSUpgradeable
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize(uint256 _number, address _creator) public initializer {
        number = _number;
        creator = _creator;
        router.approvePlugin(address(positionRouter));

        // uint256 fee = positionRouter.minExecutionFee();
        // address[] memory path = new address[](1);
        // path[0] = WETH;
        // positionRouter.createIncreasePositionETH{value: msg.value}(
        //     path,
        //     WETH,
        //     0,
        //     1000 * 1e30,
        //     true,
        //     1268 * 1e30,
        //     fee,
        //     bytes32(0)
        // );

        __Ownable_init();
    }

    function getController() public view returns (address) {
        return owner();
    }
}
