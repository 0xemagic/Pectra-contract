import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import hre, { ethers } from "hardhat";
import { Artifact } from "hardhat/types";
import { Escrow, EscrowFactory } from "../typechain";

const { expect } = chai;
chai.use(solidity);

describe("PriceOracle", () => {
  let escrow: Escrow;

  //   let stabilityFund: TestToken;
  let owner: SignerWithAddress,
    bob: SignerWithAddress,
    alice: SignerWithAddress,
    vec: SignerWithAddress,
    dave: SignerWithAddress,
    ali: SignerWithAddress;

  const depositAmount = ethers.utils.parseEther("20");
  const mintAmount = ethers.utils.parseUnits("1000");

  before(async () => {
    [owner, bob, alice, vec, dave, ali] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const Escrow = <EscrowFactory>(
      await ethers.getContractFactory("ChainlinkPriceOracle")
    );

    escrow = await Escrow.deploy();
  });
  it("Escrow", async () => {
    expect(0).to.be.equal(0);
  });
});
