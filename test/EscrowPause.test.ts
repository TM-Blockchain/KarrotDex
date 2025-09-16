import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";

async function tryGetFactory(names: string[]) {
  for (const n of names) {
    try {
      return await ethers.getContractFactory(n);
    } catch {}
  }
  throw new Error("No escrow contract found by expected names");
}

describe("Escrow contracts (pause/unpause + bytes32 API)", function () {
  it("has pause/unpause and bytes32 lockAsset overload", async function () {
    const EscrowFactory = await tryGetFactory(["KarrotEscrow1", "KarrotEscrow0"]);
    const escrow = await EscrowFactory.deploy();
    await escrow.waitForDeployment();

    // Pause works (only owner)
    await expect(escrow.pause()).to.not.be.reverted;
    const assetId = keccak256(toUtf8Bytes("USD"));
    // when paused, lockAsset(bytes32,...) should revert
    await expect(escrow.lockAsset(assetId, 100n, "0x")).to.be.reverted;

    // Unpause and call should pass (no-op if placeholder)
    await expect(escrow.unpause()).to.not.be.reverted;
    await expect(escrow.lockAsset(assetId, 100n, "0x")).to.not.be.reverted;
  });
});
