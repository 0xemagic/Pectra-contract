// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { verifyWithEtherscan } = require("hardhat-etherscan-abi");

async function main() {

  const _router = "0x3D69F5E48fE3417422727329149152FcCF1D9A1b";
  const _positionRouter = "0x2F7f73056B72C46a6DA51a46ad29453F6a727874";
  const GMXFactory = await hre.ethers.getContractFactory("GMXFactory");
  const gmxFactory = await GMXFactory.deploy(_router, _positionRouter);

  await gmxFactory.deployed();

  console.log(
    `GMXFactory deployed to ${gmxFactory.address}`
  );

  await hre.run("verify:verify", {
    address: gmxFactory.address,
    constructorArguments: [_router, _positionRouter],
  });

  // Generate Etherscan verification script
  await verifyWithEtherscan(hre, gmxFactory.address, "GMXFactory", [_router, _positionRouter]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
