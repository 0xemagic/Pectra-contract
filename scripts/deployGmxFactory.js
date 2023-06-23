const hre = require("hardhat");
const { verifyWithEtherscan } = require("hardhat-etherscan-abi");

async function main() {
  try {
    const _router = "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064";
    const _positionRouter = "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868";
    const GMXFactory = await hre.ethers.getContractFactory("GMXFactory");
    const gmxFactory = await GMXFactory.deploy(_router, _positionRouter);

    await gmxFactory.deployed();

    console.log(`GMXFactory deployed to ${gmxFactory.address}`);
    await new Promise((resolve) => setTimeout(resolve, 20000));
    console.log("Verifying..."); 

    await hre.run("verify:verify", {
      address: gmxFactory.address,
      constructorArguments: [_router, _positionRouter],
    });
    console.log("Verified!");

    // Generate Etherscan verification script
    await verifyWithEtherscan(hre, gmxFactory.address, "GMXFactory", [
      _router,
      _positionRouter,
    ]);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main();
