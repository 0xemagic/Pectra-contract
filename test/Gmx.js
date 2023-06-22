const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("GMXFactory", async function () {
    let gmxFactory;
    let deployer;
    let tokenPath;
    let positionKeeper;
    let vault;
    let _acceptablePriceLong;
    let _acceptablePriceShort;

    const _tokenPath = "0xAd70f9404504d74C1453dB9A9DdF6d974361914E";
    const _indexToken = "0x75Bd7A9086447e4D5afB06B30C13C14Bf94060eB";
    const _positionKeeper = "0x38030cAe976a82Cf17e4b89522e339df3e514a79";
    const _gmxFactory = "0x5aaa56ef3695ac3dc969EaA31F0C75e511c4f194";
    const _vault = "0x34B20Eb9E1e4b7D4C683963855DAE608be5529ab";

    //Assuming that user will long 10 USDC with 5x Leverage
    const amountIn = ethers.utils.parseEther("10");
    const _sizeDelta = ethers.utils.parseUnits("50", 30);

    before(async function () {
        const GMXFactory = await ethers.getContractFactory("GMXFactory");
        const TokenPath = await ethers.getContractFactory("Token");
        const PositionKeeper = await ethers.getContractFactory("PositionKeeper");
        const Vault = await ethers.getContractFactory("Vault");

        const signer = await ethers.getSigners();
        deployer = signer[0];
        admin = signer[1];

        gmxFactory = await GMXFactory.attach(_gmxFactory);
        tokenPath = await TokenPath.attach(_tokenPath);
        positionKeeper = await PositionKeeper.attach(_positionKeeper);
        vault = await Vault.attach(_vault);

        const _acceptablePrice = await vault.getMaxPrice(_indexToken);

        // Adjust the Prices by 1% for Acceptable Price for Long and Short
        const onePercent = ethers.utils.parseUnits("0.01", 18);
        _acceptablePriceLong = _acceptablePrice.mul(ethers.utils.parseUnits("101", 2)).div(ethers.utils.parseUnits("100", 2));
        _acceptablePriceShort = _acceptablePrice.mul(ethers.utils.parseUnits("99", 2)).div(ethers.utils.parseUnits("100", 2));

    });

    it("should create a long positions", async function () {
        this.timeout(120000);
        const value = ethers.utils.parseEther("0.00018");
        const minOut = ethers.utils.parseEther("0");
        const initialPosition = await gmxFactory.positions(deployer.address);

        // Create the long position
        approvalTx = await tokenPath.connect(deployer).approve(gmxFactory.address, amountIn);
        await approvalTx.wait(3);
        
        const creatingPositionTx = await gmxFactory.connect(deployer).openLongPosition(
            [_tokenPath, _indexToken],
            _indexToken,
            amountIn,
            minOut,
            _sizeDelta,
            _acceptablePriceLong,
            { value: value }
        );
        await creatingPositionTx.wait(10);

        // Get the number of positions for the deployer
        const positions = await gmxFactory.positions(deployer.address);

        // Assert that the number of positions is 1
        expect(positions).to.equal(Number(initialPosition) + 1);

    });

    it("should verify the position we create", async function () {

        const positions = await gmxFactory.positions(deployer.address);

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, positions);

        // Assert that the positionId is not Empty
        expect(positionId).to.not.equal(0);

    });

    it("should execute Long position", async function () {
        this.timeout(120000);

        //Executes the Position
        const executionTx = await positionKeeper.connect(admin).execute()
        await executionTx.wait(20);

    });

    it("should not close position if caller is not position keeper", async function () {
        const positionId = await gmxFactory.indexedPositions("0x41209c58D558d017b481f04C5bB1ea7EF34ea97B", 1);
        expect(positionId).to.be.revertedWith("not a position owner");
    })

    it("should close a Long position we created", async function () {
        const value = ethers.utils.parseEther("0.00018");
        const positions = await gmxFactory.positions(deployer.address);

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, positions);

        const closeTx = await gmxFactory.closePosition(positionId, [_indexToken], _acceptablePriceLong, true, { value: value });
        await closeTx.wait(5);
        expect(closeTx.status).to.equal(1);

    });

    it("should create a short positions", async function () {
        this.timeout(120000);

        const value = ethers.utils.parseEther("0.00018");
        const minOut = ethers.utils.parseEther("0");
        const initialPosition = await gmxFactory.positions(deployer.address);

        // Create the short position
        approvalTx = await tokenPath.connect(deployer).approve(gmxFactory.address, amountIn);
        await approvalTx.wait(3);

        const creatingPositionTx = await gmxFactory.connect(deployer).openShortPosition(
            [_tokenPath, _indexToken],
            _indexToken,
            amountIn,
            minOut,
            _sizeDelta,
            _acceptablePriceShort,
            { value: value }
        );
        await creatingPositionTx.wait(10);

        // Get the number of positions for the deployer
        const positions = await gmxFactory.positions(deployer.address);

        // Assert that the number of positions is 1")
        expect(positions).to.equal(Number(initialPosition) + 1);
    });

    it("should execute Short position", async function () {
        this.timeout(120000);

        //Executes the Position
        const executionTx = await positionKeeper.connect(admin).execute()
        await executionTx.wait(20);

    })

    it("should close a Short position we created", async function () {
        const value = ethers.utils.parseEther("0.00018");
        const positions = await gmxFactory.positions(deployer.address);

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, positions);

        const closeTx = await gmxFactory.closePosition(positionId, [_indexToken], _acceptablePriceShort, true, { value: value });
        await closeTx.wait(5);
        expect(closeTx.status).to.equal(1);

    });

});
