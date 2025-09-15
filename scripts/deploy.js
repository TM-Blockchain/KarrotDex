const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying contracts with:", deployer.address);

  // Example: deploy KarrotMeshOracle
  const Oracle = await hre.ethers.getContractFactory("KarrotMeshOracle");
  const oracle = await Oracle.deploy(3); // quorum = 3
  await oracle.deployed();
  console.log("✅ KarrotMeshOracle deployed at:", oracle.address);

  // Example: deploy Escrow
  const Escrow = await hre.ethers.getContractFactory("KarrotEscrow");
  const escrow = await Escrow.deploy();
  await escrow.deployed();
  console.log("✅ KarrotEscrow deployed at:", escrow.address);

  // Add pxAsset and Minter
  const PxAsset = await hre.ethers.getContractFactory("pxAsset");
  const asset = await PxAsset.deploy("pxUSD", "pxUSD");
  await asset.deployed();
  console.log("✅ pxAsset deployed at:", asset.address);

  const Minter = await hre.ethers.getContractFactory("pxAssetMinter");
  const minter = await Minter.deploy(escrow.address);
  await minter.deployed();
  console.log("✅ pxAssetMinter deployed at:", minter.address);

  // Vault
  const Vault = await hre.ethers.getContractFactory("KarrotStabilizationVault");
  const vault = await Vault.deploy(asset.address, []);
  await vault.deployed();
  console.log("✅ KarrotStabilizationVault deployed at:", vault.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
