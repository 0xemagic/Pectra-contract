// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/GMX/interfaces/IGMXFactory.sol";
import "../src/Factory/GMXFactory.sol";
import "../src/NFT/NftHandler.sol";
import "../src/NFT/PositionNFT.sol";
import "../src/GMX/interfaces/IGMXAdapter.sol";
import "../src/GMX/interfaces/IERC20.sol";
import "../src/NFT/INftHandler.sol";
import "../src/NFT/IPositionNFT.sol";
import "../src/Vault/core/interfaces/IVault.sol";
import "forge-std/Test.sol";
import "forge-std/console.sol";

/**
 * @title GMXFactoryTest
 * @dev Test contract for GMX Factory functionality
 */
contract GMXFactoryTest is Test {
    // IGMXFactory public gmxFactory;
    // INFTHandler public nftHandler;
    // IPositionNFT public positionNft;
    GMXFactory public gmxFactory;
    NFTHandler public nftHandler;
    PositionNFT public positionNft;

    IPositionRouter public positionRouter;
    IVault public vault;
    IERC20 public tokenUSDC;
    IERC20 public tokenWETH;
    IERC20 public tokenWBTC;
    uint256 _basePriceETH;
    uint256 _basePriceBTC;
    uint256 _sizeDelta;
    uint256 _acceptablePriceLongETH;
    uint256 _acceptablePriceShortETH;
    uint256 _acceptablePriceLongBTC;
    uint256 _acceptablePriceShortBTC;
    address user;
    address user2;
    address[] _path;
    address[] _pathShort;
    address[] _closingPath;
    address[] _pathEth;
    address[] _pathEthShort;
    address[] _pathEthClosing;
    address[] _pathEthClosingShort;
    uint256 tokenId;
    address admin;

    /**
     * @dev Setup function to initialize contract instances and test parameters
     */
    function setUp() public {
        //Initializing all the contracts
        // gmxFactory = IGMXFactory(0x75f688604a58c720E7e4496139765498A2563C78);
        // nftHandler = INFTHandler(0x15aF6099951BF6E21C4B234392D59C1930531DE0);
        // positionNft = IPositionNFT(0x3d8Cfe0f2d3A8E9481129d7769af1F6878746e17);
        gmxFactory = new GMXFactory(
            0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064,
            0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868,
            0x22199a49A999c351eF7927602CFB187ec3cae489,
            0x489ee077994B6658eAfA855C308275EAd8097C4A
        );
        nftHandler = new NFTHandler(address(gmxFactory));
        positionNft = new PositionNFT(
            address(nftHandler),
            "Pectra Position NFT",
            "PECTRA NFT",
            " "
        );
        nftHandler.setPositionNft(address(positionNft));
        gmxFactory.setNftHandler(address(nftHandler));

        positionRouter = IPositionRouter(
            0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868
        );
        vault = IVault(0x489ee077994B6658eAfA855C308275EAd8097C4A);

        //Initializing all the Tokens
        tokenUSDC = IERC20(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8);
        tokenWETH = IERC20(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1);
        tokenWBTC = IERC20(0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f);

        //The Amount of Collatoral we are gonna take e.g. 50$ in our case 50e30
        _sizeDelta = 50000000000000000000000000000000;

        //Getting the Acceptable Prices for ETH
        _basePriceETH = vault.getMaxPrice(address(tokenWETH));
        _acceptablePriceLongETH = _basePriceETH + (_basePriceETH * 3) / 1000; // 0.3% greater
        _acceptablePriceShortETH = _basePriceETH - (_basePriceETH * 3) / 1000; // 0.3% less

        //Getting the Acceptable Prices for BTC
        _basePriceBTC = vault.getMaxPrice(address(tokenWBTC));
        _acceptablePriceLongBTC = _basePriceBTC + (_basePriceBTC * 3) / 1000; // 0.3% greater
        _acceptablePriceShortBTC = _basePriceBTC - (_basePriceBTC * 3) / 1000; // 0.3% less

        //Addresses we are going to use to intract with the Contracts
        user = 0xa2174a7a413E1887E386Dc3afB91b92D3B51F3D0;
        user2 = 0xC5EE6A5a3F78c05636cb3678500287A2c8AcAb12;
        admin = 0xB4d2603B2494103C90B2c607261DD85484b49eF0;

        //Mints new token in the Account
        deal(address(tokenUSDC), user, 10000e6);

        //Mints new token in the Account
        deal(address(tokenWETH), user, 10000e18);

        //Adds 1 ether to the account
        vm.deal(user, 1 ether);

        //Path for the Positions USDC/WETH pair
        _path = [address(tokenUSDC), address(tokenWETH)];
        _pathShort = [address(tokenUSDC)];
        _closingPath = [address(tokenWETH), address(tokenUSDC)];

        //Path for the Positions ETH/BTC pair
        _pathEth = [address(tokenWETH), address(tokenWBTC)];
        _pathEthClosing = [address(tokenWBTC), address(tokenWETH)];
        _pathEthShort = [address(tokenWETH), address(tokenUSDC)];
        _pathEthClosingShort = [address(tokenUSDC), address(tokenWETH)];
    }

    /**
     * @dev Test cases for all the possible scenarios
     */
    function testCreateLongPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        uint256 value = positionRouter.minExecutionFee(); // Calculate value in wei

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
        assertEq(gmxFactory.getTotalTradePairs(), 1);
    }

    function testSettingPositionKeeper() public {
        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        assert(positionRouter.isPositionKeeper(user) == true);
    }

    function testExecuteLongPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        uint256 value = positionRouter.minExecutionFee(); // Calculate value in wei

        // Approve USDT for gmxFactory
        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Open long position
        bytes32 positionID = gmxFactory.openLongPosition{value: value}(
            _path,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );
        vm.stopPrank();

        //Setting the user as position Keeper to execute the position
        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionID, payable(user));
        vm.stopPrank();

        address adapter = gmxFactory.positionAdapters(positionID);
        (uint256 increaseExecuted, ) = IGMXAdapter(adapter).getExecutionState();
        assert(increaseExecuted != 0);

        uint256[] memory data = gmxFactory.getPosition(positionID);
        assert(data[0] != 0);
    }

    function testExecuteShortPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        uint256 value = positionRouter.minExecutionFee(); // Calculate value in wei

        // Approve USDT for gmxFactory
        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Open long position
        bytes32 positionID = gmxFactory.openShortPosition{value: value}(
            _pathShort,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceShortETH
        );
        vm.stopPrank();

        //Setting the user as position Keeper to execute the position
        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionID, payable(user));
        vm.stopPrank();

        address adapter = gmxFactory.positionAdapters(positionID);
        (uint256 increaseExecuted, ) = IGMXAdapter(adapter).getExecutionState();
        assert(increaseExecuted != 0);

        uint256[] memory data = gmxFactory.getPosition(positionID);
        assert(data[0] != 0);
    }

    function testCloseLongPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = positionRouter.minExecutionFee(); // Calculate value in wei

        // Approve USDT for gmxFactory
        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Open long position
        bytes32 positionID = gmxFactory.openLongPosition{value: value}(
            _path,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionID, payable(user));

        address adapter = gmxFactory.positionAdapters(positionID);
        (uint256 increaseExecuted, ) = IGMXAdapter(adapter).getExecutionState();
        assert(increaseExecuted != 0);

        gmxFactory.closePosition{value: value}(
            positionID,
            _closingPath,
            _acceptablePriceShortETH,
            false
        );
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeDecreasePosition(positionID, payable(user));
        vm.stopPrank();

        (, uint256 decreaseExecuted) = IGMXAdapter(adapter).getExecutionState();
        assert(decreaseExecuted != 0);

        uint256[] memory data = gmxFactory.getPosition(positionID);
        assert(data[0] == 0);
        assertEq(gmxFactory.getTotalTradePairs(), 1);
    }

    function testOpenAndCloseLongPositionETH() public {
        // Amount in USDT
        uint256 amountIn = (0.0054 ether); // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = positionRouter.minExecutionFee(); // Calculate value in wei

        // Approve USDT for gmxFactory
        vm.startPrank(user);

        // Open long position
        bytes32 positionID = gmxFactory.openLongPositionEth{
            value: value + amountIn
        }(
            _pathEth,
            address(tokenWBTC),
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongBTC
        );
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionID, payable(user));

        address adapter = gmxFactory.positionAdapters(positionID);
        (uint256 increaseExecuted, ) = IGMXAdapter(adapter).getExecutionState();
        assert(increaseExecuted != 0);

        gmxFactory.closePosition{value: value}(
            positionID,
            _pathEthClosing,
            _acceptablePriceShortBTC,
            true
        );
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeDecreasePosition(positionID, payable(user));
        vm.stopPrank();

        (, uint256 decreaseExecuted) = IGMXAdapter(adapter).getExecutionState();
        assert(decreaseExecuted != 0);

        uint256[] memory data = gmxFactory.getPosition(positionID);
        assert(data[0] == 0);
        assertEq(gmxFactory.getTotalTradePairs(), 1);
    }

    function testOpenAndCloseShortPositionETH() public {
        // Amount in USDT
        uint256 amountIn = (0.0054 ether); // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = positionRouter.minExecutionFee(); // Calculate value in wei

        // Approve USDT for gmxFactory
        vm.startPrank(user);

        // Open long position
        bytes32 positionID = gmxFactory.openShortPositionEth{
            value: value + amountIn
        }(
            _pathEthShort,
            address(tokenWBTC),
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceShortBTC
        );
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionID, payable(user));

        address adapter = gmxFactory.positionAdapters(positionID);

        (uint256 increaseExecuted, ) = IGMXAdapter(adapter).getExecutionState();
        assert(increaseExecuted != 0);

        gmxFactory.closePosition{value: value}(
            positionID,
            _pathEthClosingShort,
            _acceptablePriceLongBTC,
            true
        );
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeDecreasePosition(positionID, payable(user));
        vm.stopPrank();

        (, uint256 decreaseExecuted) = IGMXAdapter(adapter).getExecutionState();
        assert(decreaseExecuted != 0);

        uint256[] memory data = gmxFactory.getPosition(positionID);
        assert(data[0] == 0);
        assertEq(gmxFactory.getTotalTradePairs(), 1);
    }

    function testCreateShortPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        uint256 value = positionRouter.minExecutionFee(); // Calculate value in wei

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
            _acceptablePriceShortETH
        );

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);
        vm.stopPrank();

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition + 1);
        assertEq(gmxFactory.getTotalTradePairs(), 1);
    }

    function testCloseShortPosition() public {
        // Amount in USDT
        uint256 amountIn = 10000000; // Assuming 10 USDC

        // Calculate value for ETH based on acceptablePriceLongETH
        uint256 value = positionRouter.minExecutionFee(); // Calculate value in wei

        // Approve USDT for gmxFactory
        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Open long position
        bytes32 positionID = gmxFactory.openShortPosition{value: value}(
            _pathShort,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceShortETH
        );
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionID, payable(user));

        address adapter = gmxFactory.positionAdapters(positionID);
        (uint256 increaseExecuted, ) = IGMXAdapter(adapter).getExecutionState();
        assert(increaseExecuted != 0);

        gmxFactory.closePosition{value: value}(
            positionID,
            _path,
            _acceptablePriceLongETH,
            false
        );

        positionRouter.executeDecreasePosition(positionID, payable(user));
        vm.stopPrank();

        (, uint256 decreaseExecuted) = IGMXAdapter(adapter).getExecutionState();
        assert(decreaseExecuted != 0);

        uint256[] memory data = gmxFactory.getPosition(positionID);
        assert(data[0] == 0);
        assertEq(gmxFactory.getTotalTradePairs(), 1);
    }

    function testOpeningTwoPositions() public {
        // Amount in USDT
        uint256 _amountIn = 10000000; // Assuming 10 USDC

        uint256 value = (180000000000000 * 2); // Calculate value in wei

        GMXFactory.nftData memory _nftData = GMXFactory.nftData({
            _pathLong: _path,
            _pathShort: _pathShort,
            _indexTokenLong: address(tokenWETH),
            _indexTokenShort: address(tokenWETH),
            _amountIn: _amountIn,
            _minOut: 0,
            _sizeDeltaLong: _sizeDelta,
            _sizeDeltaShort: _sizeDelta,
            _acceptablePriceLong: _acceptablePriceLongETH,
            _acceptablePriceShort: _acceptablePriceShortETH
        });

        vm.startPrank(user);
        uint256 initialPosition = gmxFactory.getTotalPositions(user);
        tokenUSDC.approve(address(gmxFactory), (_amountIn * 2));
        gmxFactory.openPositions{value: value}(_nftData);
        vm.stopPrank();

        // Get the number of positions after opening a long position
        uint256 positions = gmxFactory.getTotalPositions(user);

        // Checking if positions increased by 1 for the user
        assertEq(positions, initialPosition + 2);
        assertEq(gmxFactory.getTotalTradePairs(), 2);
    }

    function testExecutingTwoPositions() public {
        // Amount in USDT
        uint256 _amountIn = 10000000; // Assuming 10 USDC

        uint256 value = (180000000000000 * 2); // Calculate value in wei

        GMXFactory.nftData memory _nftData = GMXFactory.nftData({
            _pathLong: _path,
            _pathShort: _pathShort,
            _indexTokenLong: address(tokenWETH),
            _indexTokenShort: address(tokenWETH),
            _amountIn: _amountIn,
            _minOut: 0,
            _sizeDeltaLong: _sizeDelta,
            _sizeDeltaShort: _sizeDelta,
            _acceptablePriceLong: _acceptablePriceLongETH,
            _acceptablePriceShort: _acceptablePriceShortETH
        });

        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), (_amountIn * 2));
        (bytes32 positionId1, bytes32 positionId2) = gmxFactory.openPositions{
            value: value
        }(_nftData);
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionId1, payable(user));
        positionRouter.executeIncreasePosition(positionId2, payable(user));
        vm.stopPrank();

        address adapter = gmxFactory.positionAdapters(positionId1);
        address adapter2 = gmxFactory.positionAdapters(positionId2);
        (uint256 increaseExecuted, ) = IGMXAdapter(adapter).getExecutionState();
        assert(increaseExecuted != 0);
        (uint256 increaseExecuted2, ) = IGMXAdapter(adapter2)
            .getExecutionState();
        assert(increaseExecuted2 != 0);

        uint256[] memory data = gmxFactory.getPosition(positionId1);
        assert(data[0] != 0);
        uint256[] memory data2 = gmxFactory.getPosition(positionId2);
        assert(data2[0] != 0);
    }

    function testCreateIncreasePosition() public {
        // Amount in USDT
        uint256 _amountIn = 10000000; // Assuming 10 USDC

        uint256 value = (180000000000000 * 2); // Calculate value in wei

        GMXFactory.nftData memory _nftData = GMXFactory.nftData({
            _pathLong: _path,
            _pathShort: _pathShort,
            _indexTokenLong: address(tokenWETH),
            _indexTokenShort: address(tokenWETH),
            _amountIn: _amountIn,
            _minOut: 0,
            _sizeDeltaLong: _sizeDelta,
            _sizeDeltaShort: _sizeDelta,
            _acceptablePriceLong: _acceptablePriceLongETH,
            _acceptablePriceShort: _acceptablePriceShortETH
        });

        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), (_amountIn * 2));
        (bytes32 positionId1, bytes32 positionId2) = gmxFactory.openPositions{
            value: value
        }(_nftData);
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 fee = 180000000000000;
        positionRouter.executeIncreasePosition(positionId1, payable(user));
        positionRouter.executeIncreasePosition(positionId2, payable(user));

        address adapter = gmxFactory.positionAdapters(positionId1);
        address adapter2 = gmxFactory.positionAdapters(positionId2);
        (uint256 increaseExecuted, ) = IGMXAdapter(adapter).getExecutionState();
        assert(increaseExecuted != 0);
        (uint256 increaseExecuted2, ) = IGMXAdapter(adapter2)
            .getExecutionState();
        assert(increaseExecuted2 != 0);

        uint256[] memory data = gmxFactory.getPosition(positionId1);
        uint256[] memory data2 = gmxFactory.getPosition(positionId2);

        tokenUSDC.approve(address(gmxFactory), _amountIn * 2);
        gmxFactory.createIncreasePosition{value: fee}(
            positionId1,
            _nftData._pathLong,
            _nftData._indexTokenLong,
            _amountIn,
            0,
            0,
            true,
            _nftData._acceptablePriceLong
        );
        gmxFactory.createIncreasePosition{value: fee}(
            positionId2,
            _nftData._pathShort,
            _nftData._indexTokenShort,
            _amountIn,
            0,
            0,
            false,
            _nftData._acceptablePriceShort
        );
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionId1, payable(user));
        positionRouter.executeIncreasePosition(positionId2, payable(user));
        vm.stopPrank();

        (uint256 increaseExecuted3, ) = IGMXAdapter(adapter)
            .getExecutionState();
        assert(increaseExecuted3 == 1);
        (uint256 increaseExecuted4, ) = IGMXAdapter(adapter2)
            .getExecutionState();
        assert(increaseExecuted4 == 1);

        uint256[] memory dataAfter = gmxFactory.getPosition(positionId1);
        assertGe(dataAfter[1], data[1]);

        uint256[] memory data2After = gmxFactory.getPosition(positionId2);
        assertGe(data2After[1], data2[1]);
    }

    function testCreateDecreasePosition() public {
        // Amount in USDT
        uint256 _amountIn = 10000000; // Assuming 10 USDC

        uint256 value = (180000000000000 * 2); // Calculate value in wei

        GMXFactory.nftData memory _nftData = GMXFactory.nftData({
            _pathLong: _path,
            _pathShort: _pathShort,
            _indexTokenLong: address(tokenWETH),
            _indexTokenShort: address(tokenWETH),
            _amountIn: _amountIn,
            _minOut: 0,
            _sizeDeltaLong: _sizeDelta,
            _sizeDeltaShort: _sizeDelta,
            _acceptablePriceLong: _acceptablePriceLongETH,
            _acceptablePriceShort: _acceptablePriceShortETH
        });

        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), (_amountIn * 2));
        (bytes32 positionId1, bytes32 positionId2) = gmxFactory.openPositions{
            value: value
        }(_nftData);
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 fee = 180000000000000;
        positionRouter.executeIncreasePosition(positionId1, payable(user));
        positionRouter.executeIncreasePosition(positionId2, payable(user));

        address adapter = gmxFactory.positionAdapters(positionId1);
        address adapter2 = gmxFactory.positionAdapters(positionId2);

        (uint256 increaseExecuted, ) = IGMXAdapter(adapter).getExecutionState();
        assert(increaseExecuted == 1);
        (uint256 increaseExecuted2, ) = IGMXAdapter(adapter2)
            .getExecutionState();
        assert(increaseExecuted2 == 1);

        uint256[] memory data1 = gmxFactory.getPosition(positionId1);
        uint256[] memory data2 = gmxFactory.getPosition(positionId2);

        _amountIn = 5000000;
        tokenUSDC.approve(address(gmxFactory), _amountIn * 2);
        gmxFactory.createDecreasePosition{value: fee}(
            positionId1,
            _closingPath,
            _amountIn,
            _nftData._acceptablePriceShort,
            false
        );
        gmxFactory.createDecreasePosition{value: fee}(
            positionId2,
            _nftData._pathShort,
            _amountIn,
            _nftData._acceptablePriceLong,
            false
        );
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeDecreasePosition(positionId1, payable(user));
        positionRouter.executeDecreasePosition(positionId2, payable(user));
        vm.stopPrank();

        (, uint256 decreaseExecuted) = IGMXAdapter(adapter).getExecutionState();
        assert(decreaseExecuted == 1);
        (, uint256 decreaseExecuted2) = IGMXAdapter(adapter2)
            .getExecutionState();
        assert(decreaseExecuted2 == 1);

        uint256[] memory data1After = gmxFactory.getPosition(positionId1);
        assertLe(data1After[1], data1[1]);

        uint256[] memory data2After = gmxFactory.getPosition(positionId2);
        assertLe(data2After[1], data2[1]);
    }

    function testMintNft() public {
        // Amount in USDT
        uint256 _amountIn = 10000000; // Assuming 10 USDC

        uint256 value = (180000000000000 * 2); // Calculate value in wei

        GMXFactory.nftData memory _nftData = GMXFactory.nftData({
            _pathLong: _path,
            _pathShort: _pathShort,
            _indexTokenLong: address(tokenWETH),
            _indexTokenShort: address(tokenWETH),
            _amountIn: _amountIn,
            _minOut: 0,
            _sizeDeltaLong: _sizeDelta,
            _sizeDeltaShort: _sizeDelta,
            _acceptablePriceLong: _acceptablePriceLongETH,
            _acceptablePriceShort: _acceptablePriceShortETH
        });

        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), (_amountIn * 2));
        (bytes32 positionId1, bytes32 positionId2) = gmxFactory.openPositions{
            value: value
        }(_nftData);
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionId1, payable(user));
        positionRouter.executeIncreasePosition(positionId2, payable(user));

        bytes32[] memory positionIDs = new bytes32[](2);
        positionIDs[0] = positionId1;
        positionIDs[1] = positionId2;

        tokenId = nftHandler.mintNFT(positionIDs, user);
        address owmerOfNft = positionNft.ownerOf(tokenId);

        vm.stopPrank();
        assertEq(user, owmerOfNft);
        assertEq(nftHandler.getTotalNftsMinted(), 1);
    }

    function testBurnNft() public {
        // Amount in USDT
        uint256 _amountIn = 10000000; // Assuming 10 USDC

        uint256 value = (180000000000000 * 2); // Calculate value in wei

        GMXFactory.nftData memory _nftData = GMXFactory.nftData({
            _pathLong: _path,
            _pathShort: _pathShort,
            _indexTokenLong: address(tokenWETH),
            _indexTokenShort: address(tokenWETH),
            _amountIn: _amountIn,
            _minOut: 0,
            _sizeDeltaLong: _sizeDelta,
            _sizeDeltaShort: _sizeDelta,
            _acceptablePriceLong: _acceptablePriceLongETH,
            _acceptablePriceShort: _acceptablePriceShortETH
        });

        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), (_amountIn * 2));
        (bytes32 positionId1, bytes32 positionId2) = gmxFactory.openPositions{
            value: value
        }(_nftData);
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionId1, payable(user));
        positionRouter.executeIncreasePosition(positionId2, payable(user));

        bytes32[] memory positionIDs = new bytes32[](2);
        positionIDs[0] = positionId1;
        positionIDs[1] = positionId2;

        tokenId = nftHandler.mintNFT(positionIDs, user);

        gmxFactory.closePosition{value: value / 2}(
            positionId1,
            _closingPath,
            _acceptablePriceShortETH,
            false
        );

        gmxFactory.closePosition{value: value / 2}(
            positionId2,
            _path,
            _acceptablePriceLongETH,
            false
        );

        positionRouter.executeDecreasePosition(positionId1, payable(user));
        positionRouter.executeDecreasePosition(positionId2, payable(user));

        nftHandler.burnNFT(tokenId);
        vm.stopPrank();

        uint256 totalSupply = positionNft.totalSupply();
        assert(totalSupply == 0);

        assert(
            gmxFactory.getPositionStatus(positionId1, user) ==
                GMXFactory.PositionStatus.Closed
        );

        assert(
            gmxFactory.getPositionStatus(positionId2, user) ==
                GMXFactory.PositionStatus.Closed
        );
    }

    function testTransferNft() public {
        // Amount in USDT
        uint256 _amountIn = 10000000; // Assuming 10 USDC

        uint256 value = (180000000000000 * 2); // Calculate value in wei

        GMXFactory.nftData memory _nftData = GMXFactory.nftData({
            _pathLong: _path,
            _pathShort: _pathShort,
            _indexTokenLong: address(tokenWETH),
            _indexTokenShort: address(tokenWETH),
            _amountIn: _amountIn,
            _minOut: 0,
            _sizeDeltaLong: _sizeDelta,
            _sizeDeltaShort: _sizeDelta,
            _acceptablePriceLong: _acceptablePriceLongETH,
            _acceptablePriceShort: _acceptablePriceShortETH
        });

        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), (_amountIn * 2));
        (bytes32 positionId1, bytes32 positionId2) = gmxFactory.openPositions{
            value: value
        }(_nftData);
        vm.stopPrank();

        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        positionRouter.executeIncreasePosition(positionId1, payable(user));
        positionRouter.executeIncreasePosition(positionId2, payable(user));

        bytes32[] memory positionIDs = new bytes32[](2);
        positionIDs[0] = positionId1;
        positionIDs[1] = positionId2;

        tokenId = nftHandler.mintNFT(positionIDs, user);
        nftHandler.transferNft(tokenId, user2);
        vm.stopPrank();

        assert(positionNft.ownerOf(tokenId) == user2);
        assert(gmxFactory.getPositionOwner(positionIDs[0]) == user2);
        assert(gmxFactory.getPositionOwner(positionIDs[1]) == user2);
        assert(gmxFactory.getTotalPositions(user2) == 2);
        assert(
            gmxFactory.getPositionStatus(positionIDs[0], user) ==
                GMXFactory.PositionStatus.Transferred
        );
        assert(
            gmxFactory.getPositionStatus(positionIDs[1], user) ==
                GMXFactory.PositionStatus.Transferred
        );
        assert(
            gmxFactory.getPositionStatus(positionIDs[0], user2) ==
                GMXFactory.PositionStatus.Opened
        );
        assert(
            gmxFactory.getPositionStatus(positionIDs[1], user2) ==
                GMXFactory.PositionStatus.Opened
        );
    }

    function testFailedPosition() public {
        // Amount in USDT
        uint256 amountIn = 5e6; // Assuming 10 USDC

        uint256 value = positionRouter.minExecutionFee(); // Calculate value in wei

        // Approve USDT for gmxFactory
        vm.startPrank(user);
        tokenUSDC.approve(address(gmxFactory), amountIn);

        // Open long position
        bytes32 positionID = gmxFactory.openLongPosition{value: value}(
            _path,
            address(tokenWETH),
            amountIn,
            0 ether, // minOut
            _sizeDelta,
            _acceptablePriceLongETH
        );
        vm.stopPrank();

        //Setting the user as position Keeper to execute the position
        vm.startPrank(admin);
        positionRouter.setPositionKeeper(user, true);
        vm.stopPrank();

        vm.startPrank(user);
        vm.expectRevert("Vault: liquidation fees exceed collateral");
        positionRouter.executeIncreasePosition(positionID, payable(user));
        vm.stopPrank();

        IGMXAdapter gmxAdapter = IGMXAdapter(
            gmxFactory.getPositionAdapter(positionID)
        );
        uint256 balanceOfAdapter = tokenUSDC.balanceOf(address(gmxAdapter));
        console.log("Balance of Token in Adapter", balanceOfAdapter);

        uint256[] memory data = gmxFactory.getPosition(positionID);
        assertEq(balanceOfAdapter, 0);
        assertEq(data[0], 0);
    }
}
