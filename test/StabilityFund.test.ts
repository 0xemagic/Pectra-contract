import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import {
  Dai,
  DaiFactory,
  StablityFund,
  StablityFundFactory,
  Usdc,
  UsdcFactory,
  Usdt,
  UsdtFactory,
} from "../typechain";
import { advanceTimeAndBlock, getLatestBlockTimestamp } from "../utils/util";

const { expect } = chai;
chai.use(solidity);

describe("StabilityFund", () => {
  let stabilityFund: StablityFund;
  let USDCToken: Usdc;
  let USDTToken: Usdt;
  let DAIToken: Dai;
  let owner: SignerWithAddress,
    bob: SignerWithAddress,
    alice: SignerWithAddress,
    vec: SignerWithAddress,
    dave: SignerWithAddress,
    ali: SignerWithAddress;
  const duration = 604800;
  const depositAmount = ethers.utils.parseUnits("100", 18);
  const swapAmount = ethers.utils.parseUnits("50", 18);
  const swapedAmount = ethers.utils.parseUnits("20", 18);

  const mintAmount = ethers.utils.parseUnits("2000", 18);

  before(async () => {
    [owner, bob, alice, vec, dave, ali] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const StabilityFund = <StablityFundFactory>(
      await ethers.getContractFactory("StablityFund")
    );
    const USDTTOKEN = <UsdtFactory>await ethers.getContractFactory("USDT");
    USDTToken = await USDTTOKEN.deploy();
    const USDCTOKEN = <UsdcFactory>await ethers.getContractFactory("USDC");
    USDCToken = await USDCTOKEN.deploy();
    const DAITOKEN = <DaiFactory>await ethers.getContractFactory("DAI");
    DAIToken = await DAITOKEN.deploy();

    stabilityFund = await StabilityFund.deploy();
    await USDTToken.connect(alice).approve(
      stabilityFund.address,
      ethers.constants.MaxUint256
    );
    await USDCToken.connect(alice).approve(
      stabilityFund.address,
      ethers.constants.MaxUint256
    );

    await USDTToken.approve(stabilityFund.address, ethers.constants.MaxUint256);
    await USDCToken.approve(stabilityFund.address, ethers.constants.MaxUint256);

    USDTToken.mint(owner.address, mintAmount);
    USDCToken.mint(owner.address, mintAmount);
    USDTToken.mint(alice.address, mintAmount);
    USDCToken.mint(alice.address, mintAmount);

    await DAIToken.connect(bob).approve(
      stabilityFund.address,
      ethers.constants.MaxUint256
    );
    DAIToken.mint(bob.address, mintAmount);
  });

  it("Add Token", async () => {
    await stabilityFund.addStableToken(USDTToken.address);
    await expect(
      stabilityFund.connect(alice).addStableToken(USDTToken.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await expect(
      stabilityFund.addStableToken(USDTToken.address)
    ).to.be.revertedWith("This token is already added.");
    const usdtAddress = await stabilityFund.tokenList(0);
    expect(usdtAddress).to.be.equal(USDTToken.address);
  });
  it("Remove Token", async () => {
    await expect(
      stabilityFund.removeStableToken(USDTToken.address)
    ).to.be.revertedWith("This token is not added or already removed.");

    await stabilityFund.addStableToken(USDTToken.address);
    await stabilityFund.addStableToken(USDCToken.address);
    await expect(
      stabilityFund.connect(alice).removeStableToken(USDTToken.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
    await stabilityFund.removeStableToken(USDTToken.address);
    const usdcAddress = await stabilityFund.tokenList(0);
    const usdtAdded = await stabilityFund.allowedToken(USDTToken.address);
    const usdcAdded = await stabilityFund.allowedToken(USDCToken.address);

    expect(usdcAddress).to.be.equal(USDCToken.address);
    expect(usdtAdded).to.be.equal(false);
    expect(usdcAdded).to.be.equal(true);
  });
  it("Set Swap Fee", async () => {
    await expect(stabilityFund.setSwapFee(0)).to.be.revertedWith(
      "fee should not be zero."
    );
    await expect(
      stabilityFund.connect(alice).setSwapFee(600)
    ).to.be.revertedWith("Ownable: caller is not the owner");
    await stabilityFund.setSwapFee(600);
    const newFee = await stabilityFund.swapFee();
    expect(newFee).to.be.equal(600);
  });
  it("Set Flashlon enable", async () => {
    await expect(stabilityFund.setFlashLoanAllowed(false)).to.be.revertedWith(
      "Flag is already set."
    );
    await stabilityFund.setFlashLoanAllowed(true);
    await expect(
      stabilityFund.connect(alice).setFlashLoanAllowed(true)
    ).to.be.revertedWith("Ownable: caller is not the owner");
    const isEnabled = await stabilityFund.flashLoanEnabled();
    expect(isEnabled).to.be.equal(true);
  });

  it("Deposit", async () => {
    await expect(
      stabilityFund.Deposit(USDTToken.address, depositAmount)
    ).to.be.revertedWith("This token is not added.");
    await stabilityFund.addStableToken(USDTToken.address);
    await expect(
      stabilityFund.Deposit(USDTToken.address, 0)
    ).to.be.revertedWith("Deposit amount should not be zero.");
    await stabilityFund.Deposit(USDTToken.address, depositAmount);
    const usdtBalance = await USDTToken.balanceOf(stabilityFund.address);
    const lpBalnace = await stabilityFund.balanceOf(owner.address);
    const totalSupply = await stabilityFund.totalSupply();
    expect(usdtBalance).to.be.equal(depositAmount);
    expect(lpBalnace).to.be.equal(depositAmount);
    expect(totalSupply).to.be.equal(depositAmount);
  });
  it("Swap", async () => {
    await expect(
      stabilityFund.Swap(USDTToken.address, depositAmount, USDCToken.address)
    ).to.be.revertedWith("This token is not added or already removed.");
    await stabilityFund.addStableToken(USDTToken.address);
    await expect(
      stabilityFund.Swap(USDTToken.address, depositAmount, USDCToken.address)
    ).to.be.revertedWith("This token is not added or already removed.");
    await stabilityFund.addStableToken(USDCToken.address);
    await expect(
      stabilityFund.Swap(USDTToken.address, 0, USDCToken.address)
    ).to.be.revertedWith("Deposit amount should not be zero.");
    await expect(
      stabilityFund.Swap(USDTToken.address, depositAmount, USDCToken.address)
    ).to.be.revertedWith("Not enough liquidity.");
    await stabilityFund.addStableToken(DAIToken.address);

    await stabilityFund.Deposit(USDTToken.address, depositAmount);
    await stabilityFund
      .connect(alice)
      .Deposit(USDCToken.address, depositAmount);
    await stabilityFund.connect(bob).Deposit(DAIToken.address, depositAmount);
    await stabilityFund.setSwapFee(600);
    await stabilityFund.Swap(USDTToken.address, swapAmount, DAIToken.address);
    const daiBal = await DAIToken.balanceOf(owner.address);
    const USDTBal = await USDTToken.balanceOf(stabilityFund.address);
    expect(daiBal).to.be.equal(swapedAmount);
    expect(USDTBal.sub(depositAmount)).to.be.equal(swapAmount);
  });

  it("Withdraw", async () => {
    await stabilityFund.addStableToken(USDTToken.address);
    await stabilityFund.addStableToken(USDCToken.address);
    await stabilityFund.addStableToken(DAIToken.address);
    await stabilityFund.Deposit(USDTToken.address, depositAmount);
    await expect(
      stabilityFund.removeStableToken(USDTToken.address)
    ).to.be.revertedWith("The balance should be zero.");
    await stabilityFund
      .connect(alice)
      .Deposit(USDCToken.address, depositAmount);
    await stabilityFund.connect(bob).Deposit(DAIToken.address, depositAmount);
    await stabilityFund.setSwapFee(600);
    await stabilityFund.Swap(USDTToken.address, swapAmount, DAIToken.address);
    const totalSupply = await stabilityFund.getTotalSupply();
    const totalPrice = await stabilityFund.getTotalValue();
    const lpPrice = await stabilityFund.getLPTokenPrice();
    expect(totalSupply).to.be.equal(ethers.utils.parseUnits("300", 18));
    expect(totalPrice).to.be.equal(ethers.utils.parseUnits("330", 18));
    expect(lpPrice).to.be.equal(ethers.utils.parseUnits("1.1", 18));
    await expect(stabilityFund.Withdraw(0)).to.be.revertedWith(
      "Deposit amount should not be zero."
    );
    await stabilityFund.Withdraw(swapAmount);
    const usdcBal = await USDCToken.balanceOf(owner.address);
    expect(usdcBal.sub(mintAmount)).to.be.gt(
      ethers.utils.parseUnits("16.6", 18)
    );
    expect(usdcBal.sub(mintAmount)).to.be.lt(ethers.utils.parseUnits("17", 18));
  });
});
