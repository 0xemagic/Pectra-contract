import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import hre, { ethers } from "hardhat";
import { Artifact } from "hardhat/types";

import {
  Dai,
  DaiFactory,
  Escrow,
  EscrowFactory,
  EscrowInit,
  EscrowInitFactory,
  Locker,
  LockerFactory,
  Usdc,
  UsdcFactory,
  Usdt,
  UsdtFactory,
} from "../typechain";
import { advanceTimeAndBlock, getLatestBlockTimestamp } from "../utils/util";

const { expect } = chai;
chai.use(solidity);

describe("Escrow", () => {
  let escrow, newEscrow: Escrow;
  let escrowInit: EscrowInit;
  let locker: Locker;
  let USDCToken: Usdc;
  let USDTToken: Usdt;
  let DAIToken: Dai;
  //   let stabilityFund: TestToken;
  let owner: SignerWithAddress,
    bob: SignerWithAddress,
    alice: SignerWithAddress,
    vec: SignerWithAddress,
    dave: SignerWithAddress,
    ali: SignerWithAddress;

  const depositAmount = ethers.utils.parseEther("20");
  const mintAmount = ethers.utils.parseUnits("10000");
  const payAmount = ethers.utils.parseUnits("1000");
  const paidAmount = ethers.utils.parseUnits("970");

  const lockDuration = 10;
  const createFee = ethers.utils.parseEther("0.1");
  const url = "https://solidity-by-example.org/defi/constant-product-amm/";

  before(async () => {
    [owner, bob, alice, vec, dave, ali] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const Escrow = <EscrowFactory>await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();
    const Locker = <LockerFactory>await ethers.getContractFactory("Locker");
    locker = await Locker.deploy();
    const EscrowInit = <EscrowInitFactory>(
      await ethers.getContractFactory("EscrowInit")
    );
    escrowInit = await EscrowInit.deploy(
      locker.address,
      lockDuration,
      createFee,
      30,
      owner.address,
      escrow.address
    );
    const USDTTOKEN = <UsdtFactory>await ethers.getContractFactory("USDT");
    USDTToken = await USDTTOKEN.deploy();
    const USDCTOKEN = <UsdcFactory>await ethers.getContractFactory("USDC");
    USDCToken = await USDCTOKEN.deploy();
    const DAITOKEN = <DaiFactory>await ethers.getContractFactory("DAI");
    DAIToken = await DAITOKEN.deploy();
    await locker.setFactoryAddress(escrowInit.address);
    await escrowInit.connect(alice).createEscrow(url, {
      value: ethers.utils.parseEther("0.1"),
    });
    const escrows = await escrowInit.escrows(alice.address, 0);
    newEscrow = await Escrow.attach(escrows);

    await USDTToken.connect(alice).approve(
      newEscrow.address,
      ethers.constants.MaxUint256
    );
    await USDCToken.connect(alice).approve(
      newEscrow.address,
      ethers.constants.MaxUint256
    );
    await USDTToken.connect(bob).approve(
      locker.address,
      ethers.constants.MaxUint256
    );
    await USDCToken.connect(bob).approve(
      locker.address,
      ethers.constants.MaxUint256
    );
    USDTToken.mint(alice.address, mintAmount);
    USDCToken.mint(alice.address, mintAmount);
  });
  it("init", async () => {
    const uri = await newEscrow.uri();
    expect(uri).to.be.equal(url);
  });

  it("update metadata", async () => {
    const newUrl = "https://moonbear.finance/";
    await newEscrow.updateMetadata(newUrl);
    const uri = await newEscrow.uri();
    expect(uri).to.be.equal(newUrl);
  });
  it("Create new milestone", async () => {
    const timestamp = await getLatestBlockTimestamp();
    await expect(
      newEscrow.createMilestone(
        USDTToken.address,
        bob.address,
        depositAmount,
        timestamp,
        "Init project"
      )
    ).to.be.revertedWith("Not owner");
    await expect(
      newEscrow
        .connect(alice)
        .createMilestone(
          USDTToken.address,
          bob.address,
          0,
          timestamp,
          "Init project"
        )
    ).to.be.revertedWith("Amount should not be zero");
    await newEscrow
      .connect(alice)
      .createMilestone(
        USDTToken.address,
        bob.address,
        payAmount,
        timestamp,
        "Init project"
      );
    const milestoneInfo = await newEscrow.milestones(0);
    expect(milestoneInfo.token).to.be.equal(USDTToken.address);
    expect(milestoneInfo.amount).to.be.equal(payAmount);
  });
  it("Update milestone", async () => {
    const timestamp = await getLatestBlockTimestamp();
    await expect(
      newEscrow.updateMilestone(
        1,
        USDTToken.address,
        bob.address,
        payAmount,
        timestamp,
        "Init project"
      )
    ).to.be.revertedWith("Not owner");

    await newEscrow
      .connect(alice)
      .createMilestone(
        USDTToken.address,
        bob.address,
        payAmount,
        timestamp,
        "Init project"
      );
    const milestoneInfo = await newEscrow.milestones(0);
    expect(milestoneInfo.token).to.be.equal(USDTToken.address);
    expect(milestoneInfo.amount).to.be.equal(payAmount);
  });

  it("Deposit milestone", async () => {
    const timestamp = await getLatestBlockTimestamp();
    await expect(newEscrow.depositMilestone(0)).to.be.revertedWith("Not owner");

    await newEscrow
      .connect(alice)
      .createMilestone(
        USDTToken.address,
        bob.address,
        payAmount,
        timestamp,
        "Init project"
      );
    await expect(
      newEscrow.connect(alice).depositMilestone(0)
    ).to.be.revertedWith("Invalid Milestone");
    await newEscrow.connect(bob).agreeMilestone(0);
    await newEscrow.connect(alice).depositMilestone(0);
    const balance = await USDTToken.balanceOf(newEscrow.address);
    expect(balance).to.be.equal(payAmount);
  });

  it("Agree milestone", async () => {
    const timestamp = await getLatestBlockTimestamp();
    await newEscrow
      .connect(alice)
      .createMilestone(
        USDTToken.address,
        bob.address,
        payAmount,
        timestamp,
        "Init project"
      );

    await newEscrow.connect(bob).agreeMilestone(0);
    await newEscrow.connect(alice).depositMilestone(0);
    await expect(newEscrow.connect(bob).agreeMilestone(0)).to.be.revertedWith(
      "Invalid Milestone"
    );
    const milestoneInfo = await newEscrow.milestones(0);
    expect(milestoneInfo.status).to.be.equal(1);
  });

  it("Release milestone", async () => {
    const timestamp = await getLatestBlockTimestamp();

    await newEscrow
      .connect(alice)
      .createMilestone(
        USDTToken.address,
        bob.address,
        payAmount,
        timestamp,
        "Init project"
      );
    await expect(newEscrow.releaseMilestone(0)).to.be.revertedWith("Not owner");
    await newEscrow.connect(bob).agreeMilestone(0);
    await expect(
      newEscrow.connect(alice).releaseMilestone(0)
    ).to.be.revertedWith("Invalid Milestone");
    await newEscrow.connect(alice).depositMilestone(0);
    const milestoneInfo = await newEscrow.milestones(0);
    await newEscrow.connect(alice).releaseMilestone(0);
    const balance = await USDTToken.balanceOf(locker.address);
    expect(balance).to.be.equal(paidAmount);
  });

  it("Dispute milestone", async () => {
    const timestamp = await getLatestBlockTimestamp();

    await newEscrow
      .connect(alice)
      .createMilestone(
        USDTToken.address,
        bob.address,
        payAmount,
        timestamp,
        "Init project"
      );
    await expect(newEscrow.createDispute(0)).to.be.revertedWith("Not owner");
    await newEscrow.connect(bob).agreeMilestone(0);

    await newEscrow.connect(alice).depositMilestone(0);
    await expect(newEscrow.connect(alice).createDispute(0)).to.be.revertedWith(
      "Fund is not released"
    );

    await newEscrow.connect(alice).releaseMilestone(0);
    await newEscrow.connect(alice).createDispute(0);

    const milestoneInfo = await newEscrow.milestones(0);
    expect(milestoneInfo.status).to.be.equal(5);
  });
  it("Dispute milestone, not passed time lock", async () => {
    const timestamp = await getLatestBlockTimestamp();

    await newEscrow
      .connect(alice)
      .createMilestone(
        USDTToken.address,
        bob.address,
        payAmount,
        timestamp,
        "Init project"
      );
    await expect(newEscrow.createDispute(0)).to.be.revertedWith("Not owner");
    await newEscrow.connect(bob).agreeMilestone(0);

    await newEscrow.connect(alice).depositMilestone(0);
    await expect(newEscrow.connect(alice).createDispute(0)).to.be.revertedWith(
      "Fund is not released"
    );

    await newEscrow.connect(alice).releaseMilestone(0);
    advanceTimeAndBlock(100);
    await expect(newEscrow.connect(alice).createDispute(0)).to.be.revertedWith(
      "Already Claimed"
    );
  });
  it("Resolve disputed milestone", async () => {
    const timestamp = await getLatestBlockTimestamp();

    await newEscrow
      .connect(alice)
      .createMilestone(
        USDTToken.address,
        bob.address,
        payAmount,
        timestamp,
        "Init project"
      );
    await expect(newEscrow.connect(alice).resolveDispute(0)).to.be.revertedWith(
      "Not Participant"
    );
    await newEscrow.connect(bob).agreeMilestone(0);

    await newEscrow.connect(alice).depositMilestone(0);

    await newEscrow.connect(alice).releaseMilestone(0);
    await expect(newEscrow.connect(bob).resolveDispute(0)).to.be.revertedWith(
      "Invalid Milestone"
    );
    await newEscrow.connect(alice).createDispute(0);
    await newEscrow.connect(bob).resolveDispute(0);
    const milestoneInfo = await newEscrow.milestones(0);
    const balance = await USDTToken.balanceOf(locker.address);
    expect(balance).to.be.equal(0);
  });
});
