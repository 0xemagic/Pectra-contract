// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../PlatformLogic/PlatformLogic.sol";

contract RefuseEther {
    PlatformLogic platformLogic;

    constructor(address _addr) {
        platformLogic = PlatformLogic(_addr);
    }

    receive() external payable {
        require(msg.value == 0);
    }

    function callApplyPlatformFeeEth(
        address _referee,
        uint256 _grossAmount
    ) external payable {
        platformLogic.applyPlatformFeeEth{value: msg.value}(
            _referee,
            _grossAmount
        );
    }

    function callApplyPlatformFeeErc20(
        address _referee,
        uint256 _grossAmount,
        IERC20 _tokenAddress,
        address _factory
    ) external {
        platformLogic.applyPlatformFeeErc20(
            _referee,
            _grossAmount,
            _tokenAddress,
            _factory
        );
    }

    function callWithdrawEthFees() external {
        platformLogic.withdrawEthFees();
    }

    function callWithdrawTokenFees(IERC20 _token) external {
        platformLogic.withdrawTokenFees(_token);
    }
}
