import { expect } from "chai";
import { ethers } from "hardhat";

describe("KarrotDexAggregator", function () {
  it("emits SwapExecuted on swapWithControls (mock)", async () => {
    const [deployer, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ERC20PresetMinterPauser");
    const t1 = await Token.deploy("Token1", "TK1");
    const t2 = await Token.deploy("Token2", "TK2");
    await t1.mint(user.address, ethers.utils.parseEther("100"));
    const Router = await ethers.getContractFactory("MockRouter");
    const router = await Router.deploy(t1.address, t2.address);
    const Agg = await ethers.getContractFactory("KarrotDexAggregator");
    const agg = await Agg.deploy();
    await agg.deployed();

    await t1.connect(user).approve(agg.address, ethers.utils.parseEther("10"));
    const data = router.interface.encodeFunctionData("swap", [ethers.utils.parseEther("10")]);
    await expect(agg.connect(user).swapWithControls(
      ethers.utils.formatBytes32String("MOCK"),
      router.address,
      t1.address,
      t2.address,
      ethers.utils.parseEther("10"),
      1,
      Math.floor(Date.now()/1000)+1000,
      data
    )).to.emit(agg, "SwapExecuted");
  });
});
