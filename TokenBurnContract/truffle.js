module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost", // TODO change host to CarVertical node server
      port: 8545,
      from: "0x426e238593d7969f1beb174287a367dd9f41362f", // TODO change address to official CV address
      network_id: 4, //TODO change id to mainnet
      gas: 799280 // TODO configure gas for mainnet deployment
    }
  }
};
