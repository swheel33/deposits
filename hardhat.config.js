require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require('dotenv').config();


// If you are using MetaMask, be sure to change the chainId to 1337
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.RINKEBY_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
    
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`
  }
};
