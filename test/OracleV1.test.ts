import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";

describe("KarrotMeshOracle1 (quorum/median/heartbeat)", function () {
  it("finalizes median with quorum and enforces heartbeat", async function () {
    const [admin, r1, r2, r3] = await ethers.getSigners();

    // Deploy oracle (try name variants if needed)
    const OracleFactory = await ethers.getContractFactory("KarrotMeshOracle1");
    const oracle = await OracleFactory.connect(admin).deploy();
    await oracle.waitForDeployment();

    // Grant reporters
    await oracle.connect(admin).addReporter(await r1.getAddress());
    await oracle.connect(admin).addReporter(await r2.getAddress());
    await oracle.connect(admin).addReporter(await r3.getAddress());

    const assetId = keccak256(toUtf8Bytes("TSLA"));
    const roundId = 1;

    // 3 submissions
    await oracle.connect(r1).submit(assetId, roundId, 100);
    await oracle.connect(r2).submit(assetId, roundId, 120);
    await oracle.connect(r3).submit(assetId, roundId, 110);

    // finalize -> median should be 110
    await oracle.finalize(assetId, roundId);
    const [value, updatedAt] = await oracle.getPrice(assetId);
    expect(value).to.equal(110);
    expect(updatedAt).to.be.greaterThan(0);

    // set short heartbeat and travel time beyond it to force staleness
    await oracle.connect(admin).setHeartbeat(1); // 1 second
    await ethers.provider.send("evm_increaseTime", [5]);
    await ethers.provider.send("evm_mine", []);

    await expect(oracle.getPrice(assetId)).to.be.revertedWithCustomError(oracle, "StaleData");
  });
});
