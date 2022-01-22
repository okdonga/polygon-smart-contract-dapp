require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");
require("./tasks/freeze");

module.exports = {
  // solidity: "0.7.3",
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337, // default: 31337 - metamask chain id issue - https://hardhat.org/metamask-issue.html
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337,
    },
    rinkeby: {
      chainId: 4,
      url: process.env.ALCHEMY_RINKEBY_RPC_URL,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    kovan: {
      chainId: 42,
      url: process.env.ALCHEMY_KOVAN_RPC_URL,
      accounts: [process.env.KOVAN_PRIVATE_KEY],
      saveDeployments: true,
    },
    mumbai: {
      // polygon testnet
      chainId: 80001,
      url: process.env.ALCHEMY_MUMBAI_RPC_URL,
      accounts: [process.env.MUMBAI_PRIVATE_KEY],
    },
    polygon: {
      chainId: 137,
      url: process.env.ALCHEMY_POLYGON_RPC_URL,
      accounts: [process.env.POLYGON_PRIVATE_KEY],
    },
    ethereum: {
      chainId: 1,
      url: process.env.ALCHEMY_RINKEBY_RPC_URL,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
  },
};
