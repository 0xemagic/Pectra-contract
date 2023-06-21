const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("GMXFactory", function () {
    let gmxFactory;
    let deployer;
    let tokenPath;

    const _router = "0x3D69F5E48fE3417422727329149152FcCF1D9A1b";
    const _positionRouter = "0x2F7f73056B72C46a6DA51a46ad29453F6a727874";
    const _tokenPath = "0xAd70f9404504d74C1453dB9A9DdF6d974361914E";
    const _indexToken = "0x75Bd7A9086447e4D5afB06B30C13C14Bf94060eB";
    const _sizeDelta = ethers.utils.parseEther("40");
    const _acceptablePrice = ethers.utils.parseEther("1831.57");
    const _acceptablePriceShort = ethers.utils.parseEther("1811.57");

    before(async function () {
        const GMXFactory = await ethers.getContractFactory("GMXFactory");
        const TokenPath = await ethers.getContractFactory("Token");
        const signer = await ethers.getSigners();
        deployer = signer[0];
        gmxFactory = await GMXFactory.deploy(_router, _positionRouter);
        await gmxFactory.deployed();
        console.log("GMX Factory deployed to:", gmxFactory.address);
        tokenPath = await TokenPath.attach(_tokenPath);
    });

    it("should create a long positions", async function () {
        const amountIn = ethers.utils.parseEther("10");
        const value = ethers.utils.parseEther("0.00018");
        const minOut = ethers.utils.parseEther("0");

        // Create the long position
        approvalTx = await tokenPath.connect(deployer).approve(gmxFactory.address, amountIn);
        await gmxFactory.connect(deployer).openLongPosition(
            [_tokenPath],
            _indexToken,
            amountIn,
            minOut,
            _sizeDelta,
            _acceptablePrice,
            { value: value }
        );

        // Get the number of positions for the deployer
        const positions = await gmxFactory.positions(deployer.address);

        // Assert that the number of positions is 1
        expect(positions).to.equal(0);

    });

    it("should create two long positions for one user", async function () {
        const amountIn = ethers.utils.parseEther("10");
        const value = ethers.utils.parseEther("0.00018");
        const minOut = ethers.utils.parseEther("0");

        // Create the first long position
        await tokenPath.connect(deployer).approve(gmxFactory.address, amountIn);
        const creatinglong = await gmxFactory.connect(deployer).openLongPosition(
            [_tokenPath],
            _indexToken,
            amountIn,
            minOut,
            _sizeDelta,
            _acceptablePrice,
            { value: value }
        );
        console.log("Creating long position:", creatinglong);

        // Create the second long position
        await tokenPath.connect(deployer).approve(gmxFactory.address, amountIn);
        await gmxFactory.connect(deployer).openLongPosition(
            [_tokenPath],
            _indexToken,
            amountIn,
            minOut,
            _sizeDelta,
            _acceptablePrice,
            { value: value }
        );

        // Get the number of positions for the deployer
        const positions = await gmxFactory.positions(deployer.address);

        // Assert that the number of positions is 2
        expect(positions).to.equal(2);
    });

    it("should return position Ids for the positions we create", async function () {
        const amountIn = ethers.utils.parseEther("10");
        const value = ethers.utils.parseEther("0.00018");
        const minOut = ethers.utils.parseEther("0");

        // Create the long position
        approvalTx = await tokenPath.connect(deployer).approve(gmxFactory.address, amountIn);
        await gmxFactory.connect(deployer).openLongPosition(
            [_tokenPath],
            _indexToken,
            amountIn,
            minOut,
            _sizeDelta,
            _acceptablePrice,
            { value: value }
        );

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, 1);

        // Assert that the positionId is not Empty
        expect(positionId).to.not.equal(0);

    });

    it("should close a position we created", async function () {
        const amountIn = ethers.utils.parseEther("10");
        const value = ethers.utils.parseEther("0.00018");
        const minOut = ethers.utils.parseEther("0");
        const initialBalance = await deployer.getBalance();

        // Create the long position
        approvalTx = await tokenPath.connect(deployer).approve(gmxFactory.address, amountIn);
        await gmxFactory.connect(deployer).openLongPosition(
            [_tokenPath],
            _indexToken,
            amountIn,
            minOut,
            _sizeDelta,
            _acceptablePrice,
            { value: value }
        );

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, 1);

        await gmxFactory.closePosition(positionId, [_tokenPath], _acceptablePrice, true);

        //Assert that balance should be increased
        const finalBalance = await deployer.getBalance();
        expect(finalBalance).to.be.gt(initialBalance);

    });

    it("should open a short position", async function () {
        const amountIn = ethers.utils.parseEther("10");
        const value = ethers.utils.parseEther("0.00018");
        const minOut = ethers.utils.parseEther("0");
    
        // Create the short position
        await tokenPath.connect(deployer).approve(gmxFactory.address, amountIn);
        await gmxFactory.connect(deployer).openShortPosition(
          [_tokenPath],
          _indexToken,
          amountIn,
          minOut,
          _sizeDelta,
          _acceptablePriceShort,
          { value: value }
        );
    
        // Get the number of positions for the deployer
        const positions = await gmxFactory.positions(deployer.address);
        console.log("Number of positions for the deployer:", positions);
    
        // Assert that the number of positions is 3
        expect(positions).to.equal(3);
      });

});
