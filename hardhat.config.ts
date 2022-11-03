import { HardhatUserConfig } from "hardhat/config";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-typechain";
import "solidity-coverage";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        // eslint-disable-next-line
        enabled: true,
        url: "https://mainnet.infura.io/v3/8b93e2f68f7f488888e6255ed3235d5c",
        blockNumber: 15767594,
      },
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
      timeout: 10000000,
    },
    bnbTest: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      timeout: 10000000,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/70c4cf77c9054fd3a3196659f7dfe4f7`,
      timeout: 10000000,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      timeout: 10000000,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
};

export default config;
