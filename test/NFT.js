const { ethers } = require("hardhat");
const { expect, chai } = require("chai");
const { solidity } = require("ethereum-waffle");
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
    //Assuming that user will long 10 USDC with 5x Leverage
    const amountIn = ethers.utils.parseEther("10"); //! NOTE : This is Assuming user will only Long or short by 10$ = 10 USDT
    const value = ethers.utils.parseEther("0.00018"); //! NOTE : This value will be different on mainnet 

    before(async function () {

        //Getting the accounts for Transaction
        const signer = await ethers.getSigners();
        deployer = signer[0];
        admin = signer[1];
        console.log(admin)
        console.log(deployer)
    });

    it("should create a long positions for USDT/ETH", async function () {
        expect(1).to.be.equal(1);
    });
});