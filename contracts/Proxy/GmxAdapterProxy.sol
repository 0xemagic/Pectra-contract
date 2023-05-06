// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.13;

// import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// import "../GMX/interfaces/IGMXAdapter.sol";
// import "../PECTRA/interfaces/IPectraAdapter.sol";

// contract GMXAdapterProxy is IPectraAdapter, UUPSUpgradeable {
//     address public immutable router;
//     address public immutable positionRouter;

//     IGMXAdapter public gmxAdapter;
//     address public owner;

//     constructor(
//         address _router, 
//         address _positionRouter
//     ) {
//         router = _router;
//         positionRouter = _positionRouter;
//     }

//     function initialize(bytes[] memory data) public initializer {
//         owner = msg.sender;
//         gmxAdapter = new IGMXAdapter(router, positionRouter);
//     }

//     modifier onlyOwner() {
//         require(owner == msg.sender, "caller is not the owner");
//         _;
//     }

//     function openPosition(bytes[] memory data) external payable onlyOwner {
//         (
//             address[] memory path, 
//             address indexToken, 
//             uint256 amountIn, 
//             uint256 minOut, 
//             uint256 sizeDelta, 
//             bool isLong, 
//             uint256 acceptablePrice, 
//             uint256 executionFee, 
//             bytes32 referralCode, 
//             address callbackTarget
//         ) = decodeAndValidateData(data);
        
//         gmxAdapter.createIncreasePosition{value: msg.value}(
//             path, 
//             indexToken, 
//             amountIn, 
//             minOut, 
//             sizeDelta, 
//             isLong, 
//             acceptablePrice, 
//             executionFee, 
//             referralCode, 
//             callbackTarget
//         );
//     }

//     function decodeAndValidateData(
//         bytes[] memory data
//     ) internal pure returns (
//         address[] memory, 
//         address, 
//         uint256, 
//         uint256, 
//         uint256, 
//         bool, 
//         uint256, 
//         uint256, 
//         bytes32, 
//         address
//     ) {
//         require(data.length == 10, "Invalid data length");

//         address[] memory path = abi.decode(data[0], (address[]));
//         address indexToken = abi.decode(data[1], (address));
//         uint256 amountIn = abi.decode(data[2], (uint256));
//         uint256 minOut = abi.decode(data[3], (uint256));
//         uint256 sizeDelta = abi.decode(data[4], (uint256));
//         bool isLong = abi.decode(data[5], (bool));
//         uint256 acceptablePrice = abi.decode(data[6], (uint256));
//         uint256 executionFee = abi.decode(data[7], (uint256));
//         bytes32 referralCode = abi.decode(data[8], (bytes32));
//         address callbackTarget = abi.decode(data[9], (address));

//         require(path.length > 0, "Path cannot be empty");
//         require(indexToken != address(0), "Index token cannot be zero address");
//         require(amountIn > 0, "Amount in should be greater than zero");
//         require(minOut > 0, "Min out should be greater than zero");
//         require(sizeDelta > 0, "Size delta should be greater than zero");
//         require(acceptablePrice > 0, "Acceptable price should be greater than zero");
//         require(executionFee >= 0, "Execution fee should be non-negative");
//         require(callbackTarget != address(0), "Callback target cannot be zero address");

//         return (path, indexToken, amountIn, minOut, sizeDelta, isLong, acceptablePrice, executionFee, referralCode, callbackTarget);
//     }

//     // @dev required for UUPSUpgradeable
//     function _authorizeUpgrade(address) internal override onlyOwner {}
// }