const { ethers } = require("hardhat");
const { expect } = require("chai");
require("dotenv").config();

describe("GMXFactory", async function () {
    let gmxFactory;
    let deployer;
    let tokenUSDT;
    let tokenWETH;
    let positionKeeper;
    let vault;
    let _acceptablePriceLongETH;
    let _acceptablePriceShortETH;
    let valueForEth;
    let _sizeDelta;

    // * Constant Values* //
    // Assuming that user will long 10 USDC with 5x Leverage
    const amountIn = ethers.utils.parseEther("10");
    const value = ethers.utils.parseEther("0.00018");

    before(async function () {

        // * Connecting to Smart Contract * //
        //Getting Artifacts for all the Smart Contracts
        const [
            GMXFactory,
            TokenUSDT,
            TokenWETH,
            PositionKeeper,
            Vault
        ] = await Promise.all([
            ethers.getContractFactory("GMXFactory"),
            ethers.getContractFactory("Token"),
            ethers.getContractFactory("Token"),
            ethers.getContractFactory("PositionKeeper"),
            ethers.getContractFactory("Vault")
        ]);


        // Connecting to all required Smart Contracts
        gmxFactory = await GMXFactory.attach(process.env.TESTNET_GMX_FACTORY);
        tokenUSDT = await TokenUSDT.attach(process.env.TESTNET_USDT);
        tokenWETH = await TokenWETH.attach(process.env.TESTNET_WETH);
        positionKeeper = await PositionKeeper.attach(process.env.TESTNET_POSITION_KEEPER);
        vault = await Vault.attach(process.env.TESTNET_VAULT);

        // * Getting Accounts from Private Keys * //
        [deployer, admin] = await ethers.getSigners();

        // * Calculating Values for Execution of Positions to be open by ETH * //
        const _acceptablePriceETH = await vault.getMaxPrice(process.env.TESTNET_WETH); // Getting current value in 1e30 from Vault
        const _acceptablePriceETH1e18 = ethers.BigNumber.from(_acceptablePriceETH).div(ethers.BigNumber.from(10).pow(12)); // Converting the Acceptable Price to 1e18 for Calculation

        // Calculate amount of ETH for 10 USD
        const amountInUSD = ethers.utils.parseUnits("10", 18);
        const amountInETH = amountInUSD.mul(ethers.utils.parseEther("1")).div(_acceptablePriceETH1e18);

        //Calculation of Value to send alongside the ETH for opening positions with ETH
        const additionalETH = ethers.utils.parseEther("0.00018");
        valueForEth = amountInETH.add(additionalETH);

        // * Calculating Acceptable Price for Long and Short * //
        // Adjust the Prices by 0.3% for Acceptable Price for Long and Short
        const percentageLongETH = ethers.utils.parseUnits("1003", 4).div(1000); // 0.3% increase
        const percentageShortETH = ethers.utils.parseUnits("997", 4).div(1000); // 0.3% decrease
        _acceptablePriceLongETH = _acceptablePriceETH.mul(percentageLongETH).div(ethers.utils.parseUnits("1", 4));
        _acceptablePriceShortETH = _acceptablePriceETH.mul(percentageShortETH).div(ethers.utils.parseUnits("1", 4));

        //Get the Current BTC Price from the Vault in 1e30
        const _acceptablePriceBTC = await vault.getMaxPrice(process.env.TESTNET_WBTC);

        // Adjust the Prices by 0.3% for Acceptable Price for Long and Short
        const percentageLongBTC = ethers.utils.parseUnits("1003", 4).div(1000); // 0.3% increase
        const percentageShortBTC = ethers.utils.parseUnits("997", 4).div(1000); // 0.3% decrease
        _acceptablePriceLongBTC = _acceptablePriceBTC.mul(percentageLongBTC).div(ethers.utils.parseUnits("1", 4));
        _acceptablePriceShortBTC = _acceptablePriceBTC.mul(percentageShortBTC).div(ethers.utils.parseUnits("1", 4));

        // * Calculating Size Delta * //
        // Calculate the amount of USD for 0.00018 ETH to deduct from Size Delta to calculate Execution Fees
        const ethAmount = ethers.utils.parseEther("0.00018");
        const usdAmount = ethAmount.mul(_acceptablePriceETH1e18).div(ethers.utils.parseEther("1"));
        const executionFees = usdAmount.mul(ethers.BigNumber.from(10).pow(12));

        //The Size Delta for 5x Leverage of 10$
        const _sizeDeltaOld = ethers.utils.parseUnits("50", 30);

        // Calculate new size delta in 1e30 format by deducting 0.1% of size delta
        const deductionPercentage = ethers.utils.parseUnits("999", 3).div(1000); // 0.1% deduction
        const sizeDeltaDeduction = _sizeDeltaOld.mul(deductionPercentage).div(ethers.utils.parseUnits("1", 3));

        // Subtract Execution Fees from Size Delta to get the new Size Delta in 1e30 format
        _sizeDelta = sizeDeltaDeduction.sub(executionFees);

    });

    it("should create a long positions for USDT/ETH", async function () {
        this.timeout(120000);

        const minOut = ethers.utils.parseEther("0");
        const initialPosition = await gmxFactory.positions(deployer.address);

        // Create the long position
        approvalTx = await tokenUSDT.connect(deployer).approve(gmxFactory.address, amountIn);
        await approvalTx.wait(); // Wait for Transaction to be Mined

        const creatingPositionTx = await gmxFactory.connect(deployer).openLongPosition(
            [process.env.TESTNET_USDT, process.env.TESTNET_WETH],
            process.env.TESTNET_WETH,
            amountIn,
            minOut,
            _sizeDelta,
            _acceptablePriceLongETH,
            _acceptablePriceLongETH,
            { value: value }
        );

        await creatingPositionTx.wait();

        // Get the number of positions for the deployer
        const positions = await gmxFactory.positions(deployer.address);

        // Assert that the number of positions is increased by 1
        expect(positions).to.equal(initialPosition.add(1));

    });

    it("should verify the position of USDT/ETH we create", async function () {

        const positions = await gmxFactory.positions(deployer.address);

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, positions);

        // Assert that the positionId is not empty
        expect(positionId).to.not.equal(ethers.constants.HashZero);

    });

    it("should execute Long position of USDT/ETH", async function () {
        this.timeout(120000);

        //Executes the Position
        const executionTx = await positionKeeper.connect(admin).execute()
        await executionTx.wait();

    });

    it("should close a Long position of USDT/ETH we created", async function () {

        const positions = await gmxFactory.positions(deployer.address);

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, positions);

        const closeTx = await gmxFactory.closePosition(positionId, [process.env.TESTNET_WETH], _acceptablePriceLongETH, true, { value: value });
        await closeTx.wait();

    });

    it("should create a short position of USDT/ETH", async function () {
        this.timeout(120000);

        const minOut = ethers.utils.parseEther("0");
        const initialPosition = await gmxFactory.positions(deployer.address);

        // Create the short position
        approvalTx = await tokenUSDT.connect(deployer).approve(gmxFactory.address, amountIn);
        await approvalTx.wait();

        const creatingPositionTx = await gmxFactory.connect(deployer).openShortPosition(
            [process.env.TESTNET_USDT, process.env.TESTNET_WETH],
            process.env.TESTNET_WETH,
            amountIn,
            minOut,
            _sizeDelta,
            _acceptablePriceShortETH,
            { value: value }
        );
        await creatingPositionTx.wait();

        // Get the number of positions for the deployer
        const positions = await gmxFactory.positions(deployer.address);

        // Assert that the number of positions is increased by 1
        expect(positions).to.equal(initialPosition.add(1));
    });

    it("should execute Short position of USDT/ETH", async function () {
        this.timeout(120000);

        //Executes the Position
        const executionTx = await positionKeeper.connect(admin).execute()
        await executionTx.wait();

    })

    it("should close a Short position of USDT/ETH we created", async function () {

        const positions = await gmxFactory.positions(deployer.address);

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, positions);

        const closeTx = await gmxFactory.closePosition(positionId, [process.env.TESTNET_WETH], _acceptablePriceShortETH, true, { value: value });
        await closeTx.wait();

    });

    it("should create a long position of ETH/BTC", async function () {
        this.timeout(120000);

        const minOut = ethers.utils.parseEther("0");
        const initialPosition = await gmxFactory.positions(deployer.address);

        //Create the long position
        approvalTx = await tokenWETH.connect(deployer).approve(gmxFactory.address, amountIn);
        await approvalTx.wait();

        const creatingPositionTx = await gmxFactory.connect(deployer).openLongPositionEth(
            [process.env.TESTNET_WETH, process.env.TESTNET_WBTC],
            process.env.TESTNET_WBTC,
            minOut,
            _sizeDelta,
            _acceptablePriceLongBTC,
            { value: valueForEth }
        );
        await creatingPositionTx.wait();

        // Get the number of positions for the deployer
        const positions = await gmxFactory.positions(deployer.address);

        // Assert that the number of positions is 1
        expect(positions).to.equal(initialPosition.add(1));

    });

    it("should execute long position of ETH/BTC", async function () {
        this.timeout(120000);

        //Executes the Position
        const executionTx = await positionKeeper.connect(admin).execute()
        await executionTx.wait();

    });

    it("should close a long position of ETH/BTC we created", async function () {

        const positions = await gmxFactory.positions(deployer.address);

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, positions);

        const closeTx = await gmxFactory.closePosition(positionId, [process.env.TESTNET_WBTC], _acceptablePriceLongBTC, false, { value: value });
        await closeTx.wait();

    });

    it("should create a short position of ETH/BTC", async function () {
        this.timeout(120000);

        const minOut = ethers.utils.parseEther("0");
        const initialPosition = await gmxFactory.positions(deployer.address);

        //Create the long position
        approvalTx = await tokenWETH.connect(deployer).approve(gmxFactory.address, amountIn);
        await approvalTx.wait();

        const creatingPositionTx = await gmxFactory.connect(deployer).openShortPositionEth(
            [process.env.TESTNET_WETH, process.env.TESTNET_WBTC],
            process.env.TESTNET_WBTC,
            minOut,
            _sizeDelta,
            _acceptablePriceShortBTC,
            { value: valueForEth }
        );
        await creatingPositionTx.wait();

        // Get the number of positions for the deployer
        const positions = await gmxFactory.positions(deployer.address);

        // Assert that the number of positions is 1
        expect(positions).to.equal(initialPosition.add(1));
    });

    it("should execute short position of ETH/BTC", async function () {
        this.timeout(120000);

        //Executes the Position
        const executionTx = await positionKeeper.connect(admin).execute()
        await executionTx.wait();

    });

    it("should close a short position of ETH/BTC we created", async function () {

        const positions = await gmxFactory.positions(deployer.address);

        // Get the number of positions for the deployer
        const positionId = await gmxFactory.indexedPositions(deployer.address, positions);

        const closeTx = await gmxFactory.closePosition(positionId, [process.env.TESTNET_WBTC], _acceptablePriceShortBTC, false, { value: value });
        await closeTx.wait();

    });

});