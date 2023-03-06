// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IRouter {
    function swap(address[] memory _path, uint256 _amountIn, uint256 _minOut, address _receiver) external;
    
    function swapETHToTokens(address[] memory _path, uint256 _minOut, address _receiver) external payable;
    
    function swapTokensToETH(address[] memory _path, uint256 _amountIn, uint256 _minOut, address payable _receiver) external;
}