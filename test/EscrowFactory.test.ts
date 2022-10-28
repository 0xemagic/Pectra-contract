import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import hre, { ethers } from "hardhat";

import {
  Escrow,
  EscrowFactory,
  EscrowInit,
  EscrowInitFactory,
  Locker,
  LockerFactory,
} from "../typechain";
import { advanceTimeAndBlock, getLatestBlockTimestamp } from "../utils/util";

const { expect } = chai;
chai.use(solidity);

describe("Escrow Factory", () => {
  let escrow: Escrow;
  let escrowInit: EscrowInit;
  let locker: Locker;

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
  });
  it("Escrow Generation", async () => {
    const oldOwnerBalance = await ethers.provider.getBalance(owner.address);
    await expect(
      escrowInit.createEscrow(url, { value: ethers.utils.parseEther("0.2") })
    ).to.be.revertedWith("Pay escrow creation fee!");
    await escrowInit.connect(alice).createEscrow(url, {
      value: ethers.utils.parseEther("0.1"),
    });
    const newOwnerBalance = await ethers.provider.getBalance(owner.address);
    expect(newOwnerBalance.sub(oldOwnerBalance)).to.be.lte(createFee);
    const escrows = await escrowInit.escrows(alice.address, 0);
    expect(escrows.length).to.be.equal(42);
  });
});
