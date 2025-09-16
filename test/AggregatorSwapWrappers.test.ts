import { expect } from "chai";
import { ethers } from "hardhat";

async function getAggregatorFactory() {
  const candidates = ["KarrotDexAggregator", "KarrotDexAggregator4", "KarrotDexAggregator3"];
  for (const n of candidates) {
    try {
      return await ethers.getContractFactory(n);
    } catch {}
  }
  throw new Error("No aggregator contract found by expected names");
}

describe("Aggregator swap wrappers", function () {
  it("swapWithControls enforces minAmountOut and deadline", async function () {
    const [user] = await ethers.getSigners();

    // Deploy tokens
    const Token = await ethers.getContractFactory("MockERC20");
    const tokenIn = await Token.deploy("IN", "IN", 18);
    const tokenOut = await Token.deploy("OUT", "OUT", 18);
    await tokenIn.waitForDeployment();
    await tokenOut.waitForDeployment();

    // Fund user
    await tokenIn.mint(await user.getAddress(), ethers.parseEther("100"));

    // Deploy router and aggregator
    const Router = await ethers.getContractFactory("MockRouter");
    const router = await Router.deploy();
    await router.waitForDeployment();

    const Agg = await getAggregatorFactory();
    const agg = await Agg.deploy();
    await agg.waitForDeployment();

    // Approve aggregator to pull
    await tokenIn.connect(user).approve(await agg.getAddress(), ethers.parseEther("10"));

    // Encode router call data (matches MockRouter.route signature)
    const iface = new ethers.Interface(["function route(bytes data,address tokenIn,address tokenOut,uint256 amountIn) returns (uint256)"]);
    const callData = iface.encodeFunctionData("route", ["0x", await tokenIn.getAddress(), await tokenOut.getAddress(), ethers.parseEther("10")]);

    const deadline = (await ethers.provider.getBlock("latest")).timestamp + 3600;
    // Expect success when minAmountOut <= amountOut (1:1 in mock)
    await expect(
      agg.connect(user).swapWithControls(
        ethers.keccak256(ethers.toUtf8Bytes("V2")),
        await router.getAddress(),
        await tokenIn.getAddress(),
        await tokenOut.getAddress(),
        ethers.parseEther("10"),
        ethers.parseEther("9.5"),
        deadline,
        callData
      )
    ).to.not.be.reverted;

    // Expect revert on slippage when minAmountOut > actual
    await expect(
      agg.connect(user).swapWithControls(
        ethers.keccak256(ethers.toUtf8Bytes("V2")),
        await router.getAddress(),
        await tokenIn.getAddress(),
        await tokenOut.getAddress(),
        ethers.parseEther("1"),
        ethers.parseEther("2"),
        deadline,
        callData
      )
    ).to.be.reverted;

    // Expect revert on deadline exceeded
    const pastDeadline = (await ethers.provider.getBlock("latest")).timestamp - 1;
    await expect(
      agg.connect(user).swapWithControls(
        ethers.keccak256(ethers.toUtf8Bytes("V2")),
        await router.getAddress(),
        await tokenIn.getAddress(),
        await tokenOut.getAddress(),
        ethers.parseEther("1"),
        0,
        pastDeadline,
        callData
      )
    ).to.be.reverted;
  });
});
