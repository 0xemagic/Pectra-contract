pragma solidity ^0.6.0;
import {PositionRouter} from "gmx-contracts/core/PositionRouter.sol";

contract GMXAssetProxy {
    address gmxRouterAddress = 0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064;
    PositionRouter public positionRouter =
        PositionRouter(0xE510571cAc76279DADf6c4b6eAcE5370F86e3dC2);

    address public owner;
    address assetAddress;
    uint256 assetValue;
    uint256 leverage;
    bool isOpen;
    mapping(address => bool) public approved;

    constructor() public {
        owner = msg.sender;
        leverage = 2;
        isOpen = true;
    }

    function setAsset(address _assetAddress, uint256 _assetValue) public {
        require(msg.sender == owner, "Only the owner can set the asset.");
        assetAddress = _assetAddress;
        assetValue = _assetValue;
    }

    function approveAsset() public {
        (bool success, bytes memory data) = gmxRouterAddress.delegatecall(
            abi.encodeWithSignature(
                "approvePlugin(address)",
                address(this)
            )
        );
        require(success, "approvePlugin call failed");
        approved[msg.sender] = true;
    }

    function openPosition(
        address[] memory path, // path we are short or long to
        address _indexToken, // asset we're trying to long or short
        uint256 _minOut, // the min amount of collateralToken to swap for.
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice,
        uint256 _executionFee,
        bytes32 _referralCode,
        address _callbackTarget
    ) public {
        positionRouter.createIncreasePositionETH(
            path,
            _indexToken,
            _minOut,
            _sizeDelta,
            _isLong,
            _acceptablePrice,
            _executionFee,
            _referralCode,
            _callbackTarget
        );
    }

    function closePosition(
        address[] memory _path,
        address _indexToken,
        uint256 _collateralDelta,
        uint256 _sizeDelta,
        bool _isLong,
        address _receiver,
        uint256 _acceptablePrice,
        uint256 _minOut,
        uint256 _executionFee,
        bool _withdrawETH,
        address _callbackTarget
    ) public {
        positionRouter.createDecreasePosition(
            _path,
            _indexToken,
            _collateralDelta,
            _sizeDelta,
            _isLong,
            _receiver,
            _acceptablePrice,
            _minOut,
            _executionFee,
            _withdrawETH,
            _callbackTarget
        );
    }

    function getAsset() public view returns (address, uint256) {
        return (assetAddress, assetValue);
    }

    function tradeAsset(address _newOwner) public {
        require(msg.sender == owner, "Only the owner can trade the asset.");
        owner = _newOwner;
    }

    function closeTrade() public {
        require(msg.sender == owner, "Only the owner can close the trade.");
        isOpen = false;
    }

    function calculateProfit() public view returns (uint256) {
        require(isOpen, "Trade is closed, profit cannot be calculated.");
        // logic to calculate profit based on current asset value and leverage
    }
}
