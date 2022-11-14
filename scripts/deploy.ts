import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther("1");

  const VRFConsumer = await ethers.getContractFactory("VRFConsumer");
  // const vrfConsumer = await VRFConsumer.deploy(
  //   "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
  //   "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  //   2524,
  //   "0x903e3E9b3F9bC6401Ad77ec8953Eb2FB6fEFC3a3",
  //   "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
  // );

  // await vrfConsumer.deployed();

  console.log(
    `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${vrfConsumer.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
