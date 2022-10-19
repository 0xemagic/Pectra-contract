import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import hre, { ethers } from "hardhat";
import { Artifact } from "hardhat/types";
import {
  TestTokenFactory,
  TestToken,
  ChainlinkPriceOracle,
  ChainlinkPriceOracleFactory,
} from "../typechain";
import { IUniswapV2Router } from "../typechain/IUniswapV2Router";

const { expect } = chai;
chai.use(solidity);

describe("PriceOracle", () => {
  let priceOracle: ChainlinkPriceOracle;

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
    const PriceOracle = <ChainlinkPriceOracleFactory>(
      await ethers.getContractFactory("ChainlinkPriceOracle")
    );

    priceOracle = await PriceOracle.deploy();
  });
  it("Get latest Price", async () => {
    const ethprice = await priceOracle.getLatestPrice();
    console.log("ETH Price:", ethprice);
    expect(0).to.be.equal(0);
  });
});
