import { expect } from "chai";
import { ethers } from "hardhat";

describe("KarrotMeshOracle1", function () {
  it("finalizes with quorum and median", async () => {
    const [admin, r1, r2, r3] = await ethers.getSigners();
    const Oracle = await ethers.getContractFactory("KarrotMeshOracle1");
    const oracle = await Oracle.deploy();
    await oracle.deployed();

    await oracle.connect(admin).addReporter(r1.address);
    await oracle.connect(admin).addReporter(r2.address);
    await oracle.connect(admin).addReporter(r3.address);

    const assetId = ethers.utils.formatBytes32String("TSLA");
    const roundId = 1;
    await oracle.connect(r1).submit(assetId, roundId, 100);
    await oracle.connect(r2).submit(assetId, roundId, 120);
    await oracle.connect(r3).submit(assetId, roundId, 140);

    await oracle.finalize(assetId, roundId);
    const [value, updatedAt] = await oracle.getPrice(assetId);
    expect(value).to.equal(120);
    expect(updatedAt).to.be.gt(0);
  });

  it("reverts if stale", async () => {
    const Oracle = await ethers.getContractFactory("KarrotMeshOracle1");
    const oracle = await Oracle.deploy();
    await oracle.deployed();
    const assetId = ethers.utils.formatBytes32String("AAPL");
    const roundId = 1;
    const [admin, r1, r2, r3] = await ethers.getSigners();
    await oracle.connect(admin).addReporter(r1.address);
    await oracle.connect(admin).addReporter(r2.address);
    await oracle.connect(admin).addReporter(r3.address);
    await oracle.connect(r1).submit(assetId, roundId, 200);
    await oracle.connect(r2).submit(assetId, roundId, 210);
    await oracle.connect(r3).submit(assetId, roundId, 220);
    await oracle.finalize(assetId, roundId);
    // artificially set heartbeat small and advance time
    await oracle.setHeartbeat(1);
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);
    await expect(oracle.getPrice(assetId)).to.be.reverted;
  });
});
