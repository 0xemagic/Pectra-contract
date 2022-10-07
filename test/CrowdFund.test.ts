import { CrowdFund } from "../typechain/CrowdFund";
import { Erc20Mock } from "../typechain/Erc20Mock";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { CrowdFundFactory } from "../typechain/CrowdFundFactory";
import { Erc20MockFactory } from "../typechain/Erc20MockFactory";
import { advanceTimeAndBlock, getLatestBlockTimestamp } from "../utils/util";

const { expect } = chai;
chai.use(solidity);

describe("CrowdFund", () => {
  let crowdFund: CrowdFund;
  let testToken: Erc20Mock;
  let owner: SignerWithAddress,
    bob: SignerWithAddress,
    alice: SignerWithAddress,
    vec: SignerWithAddress,
    dave: SignerWithAddress,
    ali: SignerWithAddress;
  const duration = 604800;
  const depositAmount = ethers.utils.parseUnits("1000", 18);
  const targetAmount = ethers.utils.parseUnits("100", 18);
  const pledgeAmount = ethers.utils.parseUnits("50", 18);
  const unPledgeAmount = ethers.utils.parseUnits("50", 18);

  before(async () => {
    [owner, bob, alice, vec, dave, ali] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const TestToken = <Erc20MockFactory>(
      await ethers.getContractFactory("ERC20Mock")
    );
    const CrowdFund = <CrowdFundFactory>(
      await ethers.getContractFactory("CrowdFund")
    );
    testToken = await TestToken.deploy();

    await testToken.mint(alice.address, depositAmount);

    await testToken.mint(bob.address, depositAmount);
    crowdFund = await CrowdFund.deploy(testToken.address);
    await testToken
      .connect(alice)
      .approve(crowdFund.address, ethers.constants.MaxUint256);
    await testToken
      .connect(bob)
      .approve(crowdFund.address, ethers.constants.MaxUint256);
  });

  it("Create Campaign", async () => {
    let currentTime = await getLatestBlockTimestamp();
    await expect(
      crowdFund.connect(bob).createCampagin(0, 1, 100)
    ).to.be.revertedWith("time already over");
    await expect(
      crowdFund
        .connect(bob)
        .createCampagin(currentTime + 100, currentTime + 610800, 100)
    ).to.be.revertedWith("invalid end time");
    await crowdFund
      .connect(bob)
      .createCampagin(currentTime + 100, currentTime + duration, targetAmount);
    const campaingData = await crowdFund.connect(bob).campaigns(0);
    expect(campaingData.claimed).to.be.equal(false);
    expect(campaingData.pledged).to.be.equal(0);
    expect(campaingData.goal).to.be.equal(targetAmount);
    const index = await crowdFund.connect(bob).index();
    expect(index).to.be.equal(1);
  });
  it("Pledge Amount", async () => {
    const currentTime = await getLatestBlockTimestamp();
    await crowdFund
      .connect(bob)
      .createCampagin(
        currentTime + 100,
        currentTime + duration + 100,
        targetAmount
      );

    await expect(
      crowdFund.connect(bob).pledge(0, pledgeAmount)
    ).to.be.revertedWith("not started");
    advanceTimeAndBlock(100);
    await crowdFund.connect(bob).pledge(0, pledgeAmount);
    const campaingData = await crowdFund.connect(bob).campaigns(0);
    expect(campaingData.pledged).to.be.equal(pledgeAmount);
    const balance0 = await testToken.balanceOf(crowdFund.address);
    expect(balance0).to.be.equal(pledgeAmount);
    advanceTimeAndBlock(100 + duration);
    await expect(
      crowdFund.connect(bob).pledge(0, pledgeAmount)
    ).to.be.revertedWith("already ended");

    // const pledgeAmount = await crowdFund.connect(bob).pledgedAmount(0);
  });
  it("unpledge Amount", async () => {
    const currentTime = await getLatestBlockTimestamp();
    await crowdFund
      .connect(bob)
      .createCampagin(
        currentTime + 100,
        currentTime + duration + 100,
        targetAmount
      );

    await expect(
      crowdFund.connect(bob).unpledge(0, pledgeAmount)
    ).to.be.revertedWith("not started");
    advanceTimeAndBlock(100);
    await crowdFund.connect(bob).pledge(0, pledgeAmount);
    await crowdFund.connect(bob).unpledge(0, pledgeAmount);
    const campaingData = await crowdFund.connect(bob).campaigns(0);
    expect(campaingData.pledged).to.be.equal(0);
    const balance0 = await testToken.balanceOf(crowdFund.address);
    expect(balance0).to.be.equal(0);
    advanceTimeAndBlock(100 + duration);
    await expect(
      crowdFund.connect(bob).unpledge(0, pledgeAmount)
    ).to.be.revertedWith("already ended");

    // const pledgeAmount = await crowdFund.connect(bob).pledgedAmount(0);
  });
  it("claim exception", async () => {
    const currentTime = await getLatestBlockTimestamp();
    await crowdFund
      .connect(bob)
      .createCampagin(
        currentTime + 100,
        currentTime + duration + 100,
        targetAmount
      );
    advanceTimeAndBlock(100);
    await crowdFund.connect(bob).pledge(0, pledgeAmount);
    // await crowdFund.connect(alice).pledge(0, pledgeAmount);
    await expect(crowdFund.connect(bob).claim(0)).to.be.revertedWith(
      "not ended"
    );

    // const campaingData = await crowdFund.connect(bob).campaigns(0);
    // expect(campaingData.pledged).to.be.equal(0);
    // const balance0 = await testToken.balanceOf(crowdFund.address);
    // expect(balance0).to.be.equal(0);
    advanceTimeAndBlock(duration + 1000);
    await expect(crowdFund.connect(alice).claim(0)).to.be.revertedWith(
      "Only creator can claim"
    );
    await expect(crowdFund.connect(bob).claim(0)).to.be.revertedWith(
      "not reached to goal"
    );
  });
  it("claim", async () => {
    const currentTime = await getLatestBlockTimestamp();
    await crowdFund
      .connect(bob)
      .createCampagin(
        currentTime + 100,
        currentTime + duration + 100,
        targetAmount
      );

    advanceTimeAndBlock(100);
    await crowdFund.connect(bob).pledge(0, pledgeAmount);
    await crowdFund.connect(alice).pledge(0, pledgeAmount);
    advanceTimeAndBlock(duration + 1000);
    await crowdFund.connect(bob).claim(0);
    const campaingData = await crowdFund.connect(bob).campaigns(0);
    expect(campaingData.claimed).to.be.equal(true);
    const balance0 = await testToken.balanceOf(crowdFund.address);
    expect(balance0).to.be.equal(0);
  });

  it("refund", async () => {
    const currentTime = await getLatestBlockTimestamp();
    await crowdFund
      .connect(bob)
      .createCampagin(
        currentTime + 100,
        currentTime + duration + 100,
        targetAmount
      );

    advanceTimeAndBlock(100);
    await crowdFund.connect(bob).pledge(0, pledgeAmount);
    advanceTimeAndBlock(duration + 1000);
    const balance0 = await testToken.balanceOf(bob.address);
    await crowdFund.connect(bob).refund(0);
    const campaingData = await crowdFund.connect(bob).campaigns(0);
    const balance1 = await testToken.balanceOf(bob.address);

    expect(campaingData.claimed).to.be.equal(false);
    const balanceContract = await testToken.balanceOf(crowdFund.address);
    expect(balanceContract).to.be.equal(0);
    expect(balance1.sub(balance0)).to.lte(pledgeAmount);
  });
  it("refund exception", async () => {
    const currentTime = await getLatestBlockTimestamp();
    await crowdFund
      .connect(bob)
      .createCampagin(
        currentTime + 100,
        currentTime + duration + 100,
        targetAmount
      );
    advanceTimeAndBlock(100);
    await crowdFund.connect(bob).pledge(0, pledgeAmount);
    await crowdFund.connect(alice).pledge(0, pledgeAmount);

    // await crowdFund.connect(alice).pledge(0, pledgeAmount);
    await expect(crowdFund.connect(bob).refund(0)).to.be.revertedWith(
      "not ended"
    );
    advanceTimeAndBlock(duration + 1000);
    await expect(crowdFund.connect(bob).refund(0)).to.be.revertedWith(
      "reached to goal"
    );
  });
});
