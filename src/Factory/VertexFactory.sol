// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../PlatformLogic/IPlatformLogic.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error TransactionFailedOnTokenTransfer();
error NotPlatformLogic();

/**
 * @notice Factory contract made to get allowances from users and execute
 * PlatformLogic's application of platform fees from the Vertex App
 */
contract VertexFactory {
    IPlatformLogic public PLATFORM_LOGIC;
    address public OWNER;

    constructor(IPlatformLogic _platformLogic) {
        OWNER = msg.sender;
        PLATFORM_LOGIC = _platformLogic;
    }

    function tokenTransferPlatformLogic(
        IERC20 _token,
        address _from,
        address _to,
        uint256 _amount
    ) external returns (bool) {
        // ensures that the caller is platformLogic contract
        if (msg.sender != address(PLATFORM_LOGIC)) revert NotPlatformLogic();
        bool success = _token.transferFrom(_from, _to, _amount);
        if (!success) revert TransactionFailedOnTokenTransfer();
        return true;
    }
}
