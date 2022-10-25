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

const { expect } = chai;
chai.use(solidity);

describe("Locker", () => {
  let escrow: Escrow;
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
  const mintAmount = ethers.utils.parseUnits("1000");
  const lockDuration = 10;
  const createFee = ethers.utils.parseEther("0.1");

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
  });
  it("Create New Lock", async () => {
    await locker.CreateLock(
      USDTToken.address,
      alice.address,
      depositAmount,
      0,
      0
    );
    const lockData = await locker.lockInfo(0);
    expect(lockData.token).to.be.equal(USDTToken.address);
  });
});
