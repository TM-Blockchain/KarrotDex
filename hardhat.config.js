require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    pulse: {
      url: "https://rpc.pulsechain.com", // replace with proper RPC
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
