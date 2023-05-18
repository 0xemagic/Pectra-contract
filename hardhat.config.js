require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

const {
  POLYGON_MUMBAI_URL,
  POLYGON_MUMBAI_DEPLOY_KEY,
  POLYGONSCAN_API_KEY
} = require("./env.json")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    polygonMumbai: {
      url: POLYGON_MUMBAI_URL,
      accounts: [POLYGON_MUMBAI_DEPLOY_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_API_KEY,
    }
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};