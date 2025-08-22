// aggregators/uniswap.js

const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 Router

const routerAbi = [
  "function exactInputSingle((address,address,uint24,address,uint256,uint256,uint160)) external payable returns (uint256 amountOut)"
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

export async function swapUniswap(tokenIn, tokenOut, amount, userAddr) {
  console.log("Swapping on Uniswap V3:", { tokenIn, tokenOut, amount, userAddr });

  if (!window.ethereum) throw new Error("Wallet provider not found");

  const { ethers } = window;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const amountIn = ethers.utils.parseUnits(amount.toString(), 18); // assumes 18 decimals
  const slippagePct = 0.005;
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const sqrtPriceLimitX96 = 0; // No price limit

  const tokenContract = new ethers.Contract(tokenIn, erc20Abi, signer);
  const router = new ethers.Contract(UNISWAP_ROUTER, routerAbi, signer);

  try {
    console.log("Approving token...");
    const approveTx = await tokenContract.approve(UNISWAP_ROUTER, amountIn);
    await approveTx.wait();
    console.log("Approval complete.");

    console.log("Executing swap...");

    const params = {
      tokenIn,
      tokenOut,
      fee: 3000, // 0.3% pool
      recipient: userAddr,
      deadline,
      amountIn,
      amountOutMinimum: amountIn.mul(995).div(1000), // 0.5% slippage
      sqrtPriceLimitX96
    };

    const tx = await router.exactInputSingle(params, { value: 0 });
    console.log("TX Submitted:", tx.hash);
    await tx.wait();
    console.log("✅ Uniswap Swap complete!");
  } catch (err) {
    console.error("Uniswap Swap Error:", err.message);
    throw err;
  }
}
