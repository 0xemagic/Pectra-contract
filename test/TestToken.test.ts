import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import hre, { ethers } from "hardhat";
import { Artifact } from "hardhat/types";
import { TestTokenFactory, TestToken } from "../typechain";
import { IUniswapV2Router } from "../typechain/IUniswapV2Router";

const { expect } = chai;
chai.use(solidity);

describe("TestToken", () => {
  let testToken: TestToken;

  //   let stabilityFund: TestToken;
  let owner: SignerWithAddress,
    bob: SignerWithAddress,
    alice: SignerWithAddress,
    vec: SignerWithAddress,
    dave: SignerWithAddress,
    ali: SignerWithAddress;

  const FACTORY = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f";
  const ROUTER = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
  const depositAmount = ethers.utils.parseEther("20");
  const mintAmount = ethers.utils.parseUnits("1000");

  before(async () => {
    [owner, bob, alice, vec, dave, ali] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const TestToken = <TestTokenFactory>(
      await ethers.getContractFactory("TestToken")
    );

    testToken = await TestToken.deploy(FACTORY, ROUTER, {
      value: depositAmount,

      gasLimit: 30000000,
    });
  });

  it("add liquidity", async () => {
    await testToken.addLiquidity();
    const tokenBalance = await testToken.balanceOf(testToken.address);
    expect(tokenBalance).to.be.equal(0);
  });
  it("transfer", async () => {
    await testToken.addLiquidity();
    await expect(
      testToken.transferToken(owner.address, alice.address, 0)
    ).to.be.revertedWith("Amount should not be zero");
    testToken.mint(owner.address, mintAmount);
    testToken.approve(owner.address, mintAmount);
    testToken.approve(alice.address, mintAmount);

    await testToken.transferToken(
      owner.address,
      alice.address,
      ethers.utils.parseUnits("50")
    );
    const tokenBalance1 = await testToken.balanceOf(testToken.address);

    const aliceBalnce1 = await testToken.balanceOf(alice.address);
    expect(tokenBalance1).to.be.equal(ethers.utils.parseUnits("5"));
    expect(aliceBalnce1).to.be.equal(ethers.utils.parseUnits("45"));
    const ethBalance1 = await ethers.provider.getBalance(testToken.address);

    await testToken.transferToken(
      owner.address,
      alice.address,
      ethers.utils.parseUnits("60")
    );
    const tokenBalance2 = await testToken.balanceOf(testToken.address);
    const aliceBalnce2 = await testToken.balanceOf(alice.address);
    const ethBalance2 = await ethers.provider.getBalance(testToken.address);
    expect(tokenBalance2).to.be.equal(ethers.utils.parseUnits("0"));
    expect(aliceBalnce2).to.be.equal(ethers.utils.parseUnits("99"));
    expect(ethBalance2).to.be.gt(ethBalance1);
  });
  it("Withdraw", async () => {
    await testToken.addLiquidity();
    testToken.mint(owner.address, mintAmount);
    testToken.approve(owner.address, mintAmount);
    testToken.approve(alice.address, mintAmount);
    await testToken.transferToken(
      owner.address,
      alice.address,
      ethers.utils.parseUnits("120")
    );
    await expect(testToken.connect(alice).withdrawETH()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
    await testToken.withdrawETH();
    const ethBalance = await ethers.provider.getBalance(testToken.address);
    expect(ethBalance).to.be.equal(0);
  });
});
