import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import hre, { ethers } from "hardhat";
import { Artifact } from "hardhat/types";

import {
  MockVrfCoordinator,
  Usdt,
  UsdtFactory,
  VrfConsumer,
  VrfConsumerFactory,
} from "../typechain";
import { advanceTimeAndBlock, getLatestBlockTimestamp } from "../utils/util";

import router_abi from "./UniswapV2Router_ABI.json";
const { expect } = chai;
chai.use(solidity);

describe("Lottery", () => {
  let vrfConsumer: VrfConsumer;
  let mockToken: Usdt;
  let routerContract;
  //   let stabilityFund: TestToken;
  let owner: SignerWithAddress,
    bob: SignerWithAddress,
    alice: SignerWithAddress,
    vec: SignerWithAddress,
    dave: SignerWithAddress,
    ali: SignerWithAddress;
  const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const depositAmount = ethers.utils.parseEther("20");
  const mintAmount = ethers.utils.parseUnits("1000");
  let mockVrfCoordinator: MockVrfCoordinator;
  before(async () => {
    [owner, bob, alice, vec, dave, ali] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const USDTTOKEN = <UsdtFactory>await ethers.getContractFactory("USDT");
    mockToken = await USDTTOKEN.deploy();
    const routerContract = await ethers.getContractAt(router_abi, ROUTER);
    const timestamp = await getLatestBlockTimestamp();
    await mockToken.approve(ROUTER, ethers.constants.MaxUint256);
    await mockToken.mint(owner.address, mintAmount);
    await mockToken.approve(owner.address, ethers.constants.MaxUint256);

    await routerContract.addLiquidityETH(
      mockToken.address,
      ethers.utils.parseUnits("800"),
      1,
      1,
      owner.address,
      timestamp + 864000,
      {
        value: ethers.utils.parseEther("3"),
      }
    );
    const VRFConsumer = <VrfConsumerFactory>(
      await ethers.getContractFactory("VRFConsumer")
    );
    const vrfCoordFactory = await ethers.getContractFactory(
      "MockVRFCoordinator"
    );
    mockVrfCoordinator = <MockVrfCoordinator>(
      await vrfCoordFactory.connect(owner).deploy(100, 100)
    );
    await mockVrfCoordinator.createSubscription();
    await mockVrfCoordinator.fundSubscription(1, mintAmount);

    vrfConsumer = await VRFConsumer.deploy(
      mockVrfCoordinator.address,
      mockToken.address,
      1,
      dave.address,
      ROUTER
    );
    await mockVrfCoordinator.addConsumer(1, vrfConsumer.address);
  });
  it("entry lottery", async () => {
    await expect(
      vrfConsumer.entryLottery({ value: ethers.utils.parseEther("0.2") })
    ).to.be.revertedWith("entry fee should be 0.1 Ether");
    await vrfConsumer.entryLottery({ value: ethers.utils.parseEther("0.1") });
    await vrfConsumer
      .connect(alice)
      .entryLottery({ value: ethers.utils.parseEther("0.1") });
    await vrfConsumer
      .connect(bob)
      .entryLottery({ value: ethers.utils.parseEther("0.1") });
    await vrfConsumer
      .connect(vec)
      .entryLottery({ value: ethers.utils.parseEther("0.1") });
    await vrfConsumer
      .connect(dave)
      .entryLottery({ value: ethers.utils.parseEther("0.1") });
    await expect(
      vrfConsumer.entryLottery({ value: ethers.utils.parseEther("0.1") })
    ).to.be.revertedWith("lottery is not started yet");
  });

  it("get Request", async () => {
    await expect(
      vrfConsumer.entryLottery({ value: ethers.utils.parseEther("0.2") })
    ).to.be.revertedWith("entry fee should be 0.1 Ether");
    await vrfConsumer.entryLottery({ value: ethers.utils.parseEther("0.1") });
    await vrfConsumer
      .connect(alice)
      .entryLottery({ value: ethers.utils.parseEther("0.1") });
    const beforeBal = await ethers.provider.getBalance(alice.address);

    await vrfConsumer
      .connect(bob)
      .entryLottery({ value: ethers.utils.parseEther("0.1") });
    await vrfConsumer
      .connect(vec)
      .entryLottery({ value: ethers.utils.parseEther("0.1") });
    await expect(
      vrfConsumer
        .connect(dave)
        .entryLottery({ value: ethers.utils.parseEther("0.1") })
    ).to.emit(vrfConsumer, "RequestSent");
    const da = await vrfConsumer.members(4);
    console.log("5th member", da);
    console.log("5th member", dave.address);
    await expect(
      mockVrfCoordinator.fulfillRandomWords(1, vrfConsumer.address)
    ).to.emit(mockVrfCoordinator, "RandomWordsFulfilled");
    const afterBal = await ethers.provider.getBalance(alice.address);
    const data = await vrfConsumer.getRequestStatus(1);
    expect(afterBal.sub(beforeBal)).to.be.lt(ethers.utils.parseEther("0.5"));
    expect(afterBal.sub(beforeBal)).to.be.gt(ethers.utils.parseEther("0.4"));
    // await expect(
    //   vrfConsumer.entryLottery({ value: ethers.utils.parseEther("0.1") })
    // ).to.be.revertedWith("lottery is not started yet");
  });
});
