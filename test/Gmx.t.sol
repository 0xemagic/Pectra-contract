// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/GMX/interfaces/IGMXFactory.sol";
import "../src/GMX/interfaces/IERC20.sol";
import "../src/NFT/INftHandler.sol";
import "../src/NFT/IPositionNFT.sol";
import "forge-std/Test.sol";
import "forge-std/console.sol";

contract GMXFactoryTest is Test {
    IGMXFactory public gmxFactory;
    INFTHandler public nftHandler;
    IPositionNFT public positionNft;
    IERC20 public tokenUSDC;
    IERC20 public tokenWETH;
    IERC20 public tokenWBTC;
    uint256 _sizeDelta;
    uint256 _acceptablePriceLongETH;
    uint256 _acceptablePriceShortETH;
    uint256 _acceptablePriceLongBTC;
    uint256 _acceptablePriceShortBTC;
    address user;
    address[] _path;
    address[] _closingPath;
    address[] _pathEth;
    address[] _pathEthClosing;
    bytes32[] positionIDs;
    uint256 tokenId;

    function setUp() public {
        gmxFactory = IGMXFactory(0xA686BAC279C957E7be53fFf5B44d06e46ea77Eaa);
        nftHandler = INFTHandler(0x1D8F9F489A4E9395488E808d2C46F6B06F99CeD7);
        positionNft = IPositionNFT(0x71CEa516BA646055eBb1aeA87d7045CAa71977C5);

        tokenUSDC = IERC20(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8);
        tokenWETH = IERC20(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1);
        tokenWBTC = IERC20(0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f);

        _sizeDelta = 50000000000000000000000000000000;
        _acceptablePriceLongETH = 2117686000000000000000000000000000;
        _acceptablePriceShortETH = 1858100000000000000000000000000000;

        _acceptablePriceLongBTC = 31593100000000000000000000000000000;
        _acceptablePriceShortBTC = 27593100000000000000000000000000000;

        user = 0xa2174a7a413E1887E386Dc3afB91b92D3B51F3D0;

        deal(address(tokenUSDC), user, 10000e6);

        _path = [address(tokenUSDC), address(tokenWETH)];
        _closingPath = [address(tokenWETH), address(tokenUSDC)];

        _pathEth = [address(tokenWETH), address(tokenWBTC)];
        _pathEthClosing = [address(tokenWBTC), address(tokenWETH)];
    }

    function testCreateLongPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = (0.00018 ether); // Calculate value in wei

        // Approve USDT for gmxFactory
        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Initial position count
        uint256 initialPosition = gmxFactory.getTotalPositions(user);

        // Open long position
        gmxFactory.openLongPosition{value: value}(
            _path,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);
        vm.stopPrank();

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition + 1);
    }

    function testVerifyLongPositionOnGMX() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = (0.00018 ether); // Calculate value in wei

        // Approve USDT for gmxFactory
        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Open long position
        gmxFactory.openLongPosition{value: value}(
            _path,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );

        bytes32 _positionId = gmxFactory.getPositionId(user, 1);
        uint256[] memory data = gmxFactory.getPosition(_positionId);

        vm.stopPrank();

        // Checking if positions increased by 1 for the user
        assert(data[0] != 0);
    }

    function testCloseLongPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = (0.00018 ether); // Calculate value in wei

        vm.startPrank(user);

        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Open long position
        gmxFactory.openLongPosition{value: value}(
            _path,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );

        uint256 initialPosition = gmxFactory.getTotalPositions(user);
        bytes32 positionId = gmxFactory.getPositionId(user, initialPosition);

        gmxFactory.closePosition(
            positionId,
            _closingPath,
            _acceptablePriceShortETH,
            false
        );

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);
        vm.stopPrank();

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition - 1);
    }

    function testCreateShortPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = (0.00018 ether); // Calculate value in wei

        vm.startPrank(user);
        // Initial position count
        uint256 initialPosition = gmxFactory.getTotalPositions(user);

        // Approve USDT for gmxFactory
        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Open long position
        gmxFactory.openShortPosition{value: value}(
            _path,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);
        vm.stopPrank();

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition + 1);
    }

    function testCloseShortPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = (0.00018 ether); // Calculate value in wei

        vm.startPrank(user);
        // Approve USDT for gmxFactory
        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Open long position
        gmxFactory.openShortPosition{value: value}(
            _path,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );

        uint256 initialPosition = gmxFactory.getTotalPositions(user);

        bytes32 positionId = gmxFactory.getPositionId(user, initialPosition);

        gmxFactory.closePosition(
            positionId,
            _closingPath,
            _acceptablePriceLongETH,
            false
        );

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);

        vm.stopPrank();

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition - 1);
    }

    function testCreateLongPositionEth() public {
        // Amount in USDT
        uint256 amountIn = (0.0054 ether); // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = (0.00018 ether); // Calculate value in wei

        // Initial position count
        uint256 initialPosition = gmxFactory.getTotalPositions(user);

        vm.startPrank(user);

        // Open long position
        gmxFactory.openLongPositionEth{value: value + amountIn}(
            _pathEth,
            address(tokenWBTC),
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);

        vm.stopPrank();

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition + 1);
    }

    function testCloseLongPositionEth() public {
        // Amount in USDT
        uint256 amountIn = (0.0054 ether); // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = (0.00018 ether); // Calculate value in wei

        vm.startPrank(user);

        // Open long position
        gmxFactory.openLongPositionEth{value: value + amountIn}(
            _pathEth,
            address(tokenWBTC),
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );

        uint256 initialPosition = gmxFactory.getTotalPositions(user);

        bytes32 positionId = gmxFactory.getPositionId(user, initialPosition);

        gmxFactory.closePosition(
            positionId,
            _path,
            _acceptablePriceShortBTC,
            true
        );

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);

        vm.stopPrank();

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition - 1);
    }

    function testCreateShortPositionEth() public {
        // Amount in USDT
        uint256 amountIn = (0.0054 ether); // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = (0.00018 ether); // Calculate value in wei

        // Initial position count
        uint256 initialPosition = gmxFactory.getTotalPositions(user);

        vm.startPrank(user);

        // Open long position
        gmxFactory.openLongPositionEth{value: value + amountIn}(
            _pathEth,
            address(tokenWBTC),
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);

        vm.stopPrank();

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition + 1);
    }

    function testCloseShortPositionEth() public {
        // Amount in USDT
        uint256 amountIn = (0.0054 ether); // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = (0.00018 ether); // Calculate value in wei

        vm.startPrank(user);

        // Open long position
        gmxFactory.openLongPositionEth{value: value + amountIn}(
            _pathEth,
            address(tokenWBTC),
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );

        // Get the number of positions after opening a long position
        uint256 initialPosition = gmxFactory.getTotalPositions(user);

        bytes32 positionId = gmxFactory.getPositionId(user, initialPosition);

        gmxFactory.closePosition(
            positionId,
            _path,
            _acceptablePriceLongBTC,
            true
        );

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition - 1);
    }

    // function testOpeningTwoPositions() public {
    //     uint256 initialPosition = gmxFactory.getTotalPositions(user);
    //     // Amount in USDT
    //     uint256 _amountIn = 10000000; // Assuming 10 USDC

    //     // Calculate value for ETH based on acceptablePriceLongETH
    //     uint256 value = (0.00036 ether); // Calculate value in wei

    //     positionIDs = gmxFactory.openPositions{value: value}(
    //         nftData _nftData
    //     );

    //     // Get the number of positions after opening a long position
    //     uint256 positions = gmxFactory.getTotalPositions(user);

    //     // Checking if positions increased by 1 for the user
    //     assertEq(positions, initialPosition + 2);
    // }

    // function testMintNft() public {
    //     tokenId = nftHandler.mintNFT(positionIDs, user);

    //     address owmerOfNft = positionNft.ownerOf(tokenId);

    //     assertEq(user, owmerOfNft);
    // }

    // function testBurnNft() public {
    //     uint256 _tokenId = nftHandler.mintNFT(positionIDs, user);

    //     uint256 initialTotalSupply = positionNft.totalSupply();

    //     nftHandler.burnNFT(_tokenId);

    //     assertEq(initialTotalSupply, positionNft.totalSupply() - 1);
    // }
}
