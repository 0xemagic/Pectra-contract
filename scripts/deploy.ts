import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from "@openzeppelin/upgrades-core";
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther("1");

  const UpgradesFund = await ethers.getContractFactory(
    "UpgradeableStabilityFund"
  );
  const upgradesFund = await upgrades.upgradeProxy(
    "0xeab8becB9da913E91204A17146Fbdf9ABB327670",
    UpgradesFund
  );

  // const upgradesFund = await upgrades.deployProxy(UpgradesFund);

  await upgradesFund.deployed();
  const currentImplAddress = await getImplementationAddress(
    ethers.provider,
    upgradesFund.address
  );
  await hre.run("verify:verify", {
    address: currentImplAddress,
  });
  console.log(
    `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${upgradesFund.address},, ${currentImplAddress}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
