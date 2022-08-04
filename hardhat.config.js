/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");

module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      evmVersion: "constantinople",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    //rinkeby: {
    //url: process.env.STAGING_ALCHEMY_KEY,
    //accounts: [process.env.PRIVATE_KEY],
    //},
    // mainnet: {
    //   chainId: 1,
    //   url: process.env.PROD_ALCHEMY_KEY,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
  gasReporter: {
    currency: "USD",
    token: "MATIC",
    gasPrice: 100,
    coinmarketcap: process.env.CMC_API_KEY,
  },
};
