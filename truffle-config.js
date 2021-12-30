require('@babel/register');
require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKeys = process.env.PRIVATE_KEYS;

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    kovan: {
      provider: () => {
        return new HDWalletProvider(
          privateKeys.split(','),
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
        );
      },
      gas: 6000000,
      gasPrice: 10000000000,
      network_id: 42,
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  mocha: {
    // timeout: 100000
  },
  compilers: {
    solc: {
      version: "0.7.4",    // Fetch exact version from solc-bin (default: truffle's version)
       optimizer: {
         enabled: true,
         runs: 200
       },
    }
  },
   db: {
    enabled: false
  }
};
