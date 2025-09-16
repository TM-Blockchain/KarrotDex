import { expect } from "chai";
import { ethers } from "hardhat";

describe("KarrotEscrow", function () {
  it("has lockAsset(bytes32) callable", async () => {
    const Escrow = await ethers.getContractFactory("KarrotEscrow1");
    const escrow = await Escrow.deploy();
    await escrow.deployed();
    const assetId = ethers.utils.formatBytes32String("TEST");
    await expect(escrow.lockAsset(assetId, 100, "0x")).to.not.be.reverted;
  });
});
