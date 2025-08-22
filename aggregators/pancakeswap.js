// aggregators/pancakeswap.js

const PANCAKESWAP_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // Mainnet V2 Router

const routerAbi = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

export async function swapPancakeSwap(tokenIn, tokenOut, amount, userAddr) {
  console.log("Swapping on PancakeSwap:", { tokenIn, tokenOut, amount, userAddr });

  if (!window.ethereum) throw new Error("Wallet provider not found");

  const { ethers } = window;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const amountIn = ethers.utils.parseUnits(amount.toString(), 18); // assumes 18 decimals
  const amountOutMin = amountIn.mul(995).div(1000); // 0.5% slippage
  const path = [tokenIn, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 600;

  const tokenContract = new ethers.Contract(tokenIn, erc20Abi, signer);
  const router = new ethers.Contract(PANCAKESWAP_ROUTER, routerAbi, signer);

  try {
    console.log("Approving token...");
    const approveTx = await tokenContract.approve(PANCAKESWAP_ROUTER, amountIn);
    await approveTx.wait();
    console.log("Approval complete.");

    console.log("Executing swap...");
    const tx = await router.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      userAddr,
      deadline
    );

    console.log("TX Submitted:", tx.hash);
    await tx.wait();
    console.log("✅ PancakeSwap Swap complete!");
  } catch (err) {
    console.error("PancakeSwap Swap Error:", err.message);
    throw err;
  }
}
