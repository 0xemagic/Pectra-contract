// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

interface IEscrowInit {
    function createEscrow(string memory _uri) external payable;

    function destroy(address _owner) external;

    function isEscrow(address _address) external view returns (bool);

    function feePercent() external view returns (uint256);

    function feeRecipient() external view returns (address);

    function lockDuration() external view returns (uint256);

    function locker() external view returns (address);
}
