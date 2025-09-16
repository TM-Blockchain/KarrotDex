const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Karrot Protocol", function () {
  it("Deploys pxAsset and checks total supply = 0", async function () {
    const PxAsset = await ethers.getContractFactory("pxAsset");
    const px = await PxAsset.deploy("pxUSD", "pxUSD");
    await px.deployed();

    expect(await px.totalSupply()).to.equal(0);
  });
});
