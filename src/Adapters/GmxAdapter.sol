// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../GMX/interfaces/IERC20.sol";
import "../GMX/interfaces/IGMXAdapter.sol";
import "../../lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";

error NotOwnerOrFactory();

contract GMXAdapter is Initializable {
    address public FACTORY;
    address public OWNER;
    address public ROUTER;
    address public POSITION_ROUTER;
    address constant ZERO_ADDRESS = address(0);
    bytes32 constant ZERO_VALUE =
        0x0000000000000000000000000000000000000000000000000000000000000000;

    address[] private path;
    address private collateralToken;
    address private indexToken;
    uint256 private amountIn;
    uint256 private minOut;
    uint256 private sizeDelta;
    bool private isLong;
    uint256 private acceptablePrice;

    modifier onlyOwner() {
        if (OWNER != msg.sender || FACTORY != msg.sender)
            revert NotOwnerOrFactory();
        _;
    }

    receive() external payable {}

    constructor() {
        FACTORY = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(
        address _router,
        address _positionRouter,
        address _owner
    ) external onlyOwner initializer {
        ROUTER = _router;
        POSITION_ROUTER = _positionRouter;
        OWNER = _owner;
    }

    function approve(
        address token,
        address spender,
        uint256 amount
    ) external onlyOwner returns (bool) {
        return IERC20(token).approve(spender, amount);
    }

    function approvePlugin(address _plugin) external onlyOwner {
        IRouter(ROUTER).approvePlugin(_plugin);
    }

    function createIncreasePosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice
    ) external payable onlyOwner returns (bytes32) {
        uint256 _executionFee = IPositionRouter(POSITION_ROUTER)
            .minExecutionFee();
        bytes32 result = IPositionRouter(POSITION_ROUTER)
            .createIncreasePosition{value: msg.value}(
            _path,
            _indexToken,
            _amountIn,
            _minOut,
            _sizeDelta,
            _isLong,
            _acceptablePrice,
            _executionFee,
            ZERO_VALUE,
            ZERO_ADDRESS
        );
        setPositionData(
            _path,
            _indexToken,
            _amountIn,
            _minOut,
            _sizeDelta,
            _isLong,
            _acceptablePrice
        );
        return result;
    }

    function createIncreasePositionETH(
        address[] memory _path,
        address _indexToken,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice
    ) external payable onlyOwner returns (bytes32) {
        uint256 _executionFee = IPositionRouter(POSITION_ROUTER)
            .minExecutionFee();
        bytes32 result = IPositionRouter(POSITION_ROUTER)
            .createIncreasePositionETH{value: msg.value}(
            _path,
            _indexToken,
            _minOut,
            _sizeDelta,
            _isLong,
            _acceptablePrice,
            _executionFee,
            ZERO_VALUE,
            ZERO_ADDRESS
        );
        setPositionData(
            _path,
            _indexToken,
            msg.value - _executionFee,
            _minOut,
            _sizeDelta,
            _isLong,
            _acceptablePrice
        );
        return result;
    }

    function closePosition(
        address[] memory _path,
        address _receiver,
        uint256 _acceptablePrice,
        bool _withdrawETH
    ) external payable onlyOwner returns (bytes32) {
        uint256 _executionFee = IPositionRouter(POSITION_ROUTER)
            .minExecutionFee();
        try
            IPositionRouter(POSITION_ROUTER).createDecreasePosition{
                value: msg.value
            }(
                _path,
                indexToken,
                0,
                sizeDelta,
                isLong,
                _receiver,
                _acceptablePrice,
                0,
                _executionFee,
                _withdrawETH,
                ZERO_ADDRESS
            )
        returns (bytes32 result) {
            return result;
        } catch {
            address collateral = path[path.length - 1];
            uint256 collateralBalance = IERC20(collateral).balanceOf(
                address(this)
            );
            if (collateralBalance > 0) {
                IERC20(collateral).transfer(_receiver, collateralBalance);
            } else if (address(this).balance > 0) {
                (bool success, ) = _receiver.call{value: address(this).balance}(
                    ""
                );
                require(success, "Transfer failed!");
            }
        }
        return "";
    }

    function withdrawToken(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner returns (bool) {
        return IERC20(token).transfer(to, amount);
    }

    function withdrawEth(
        address to,
        uint256 amount
    ) external onlyOwner returns (bool) {
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed!");
        return success;
    }

    function setPositionData(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice
    ) internal {
        path = _path;
        collateralToken = _path[_path.length - 1];
        indexToken = _indexToken;
        amountIn = _amountIn;
        minOut = _minOut;
        sizeDelta = _sizeDelta;
        isLong = _isLong;
        acceptablePrice = _acceptablePrice;
    }

    function getPositionData()
        external
        view
        returns (
            address[] memory,
            address,
            address,
            uint256,
            uint256,
            uint256,
            bool,
            uint256
        )
    {
        return (
            path,
            collateralToken,
            indexToken,
            amountIn,
            minOut,
            sizeDelta,
            isLong,
            acceptablePrice
        );
    }
}
