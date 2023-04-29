// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IPectraAdapter {
  function initialize(bytes[] memory data) external;
  function openPosition(bytes[] memory data) external payable;
}