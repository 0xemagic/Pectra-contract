// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
import "../GMX/interfaces/IRouter.sol";

contract GMXFactory {
    
    address public OWNER;
    address public ROUTER;
    address public POSITION_ROUTER;

    // Mapping from position to owner
    mapping (address => address) positions; //each position contract has an owner

    // Mapping from owner to list of owned positions
    mapping(address => mapping(uint256 => address)) private _ownedTokens;

    constructor(address _router, address _positionRouter) {
        OWNER = msg.sender;
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;
    }

    modifier onlyOwner() {
        require(OWNER == msg.sender, "caller is not the owner");
        _;
    }
    function swap(address[] memory _path, uint256 _amountIn, uint256 _minOut, address _receiver) external onlyOwner {
        IRouter(ROUTER).swap(_path, _amountIn, _minOut, _receiver);
    }
    
    function swapETHToTokens(address[] memory _path, uint256 _minOut, address _receiver) external payable onlyOwner {
        IRouter(ROUTER).swapETHToTokens{value: msg.value}(_path, _minOut, _receiver);
    }
    
    function swapTokensToETH(address[] memory _path, uint256 _amountIn, uint256 _minOut, address payable _receiver) external onlyOwner {
        IRouter(ROUTER).swapTokensToETH(_path, _amountIn, _minOut, _receiver);
    }

    function withdrawToken(address token, address to, uint256 amount) external onlyOwner returns (bool) {
        return IERC20(token).transfer(to, amount);
    }

    function withdrawEth(address to, uint256 amount) external onlyOwner returns (bool) {
        (bool success,) = to.call{ value: amount}("");
        require(success, "Transfer failed!");
        return success;
    }

    function openLongPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32) {
    }

    function openShortPosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        uint256 _acceptablePrice
    ) external payable returns (bytes32) {
    }

}