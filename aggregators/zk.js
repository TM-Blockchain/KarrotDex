// aggregators/zk.js

const ZK_ROUTER = "0xYourZkRouterAddressHere"; // 🔁 Replace with actual ZK DEX router

const routerAbi = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

export async function swapZK(tokenIn, tokenOut, amount, userAddr) {
  console.log("Swapping on ZK DEX:", { tokenIn, tokenOut, amount, userAddr });

  if (!window.ethereum) throw new Error("Wallet provider not found");

  const { ethers } = window;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const amountIn = ethers.utils.parseUnits(amount.toString(), 18); // assumes 18 decimals
  const amountOutMin = amountIn.mul(995).div(1000); // 0.5% slippage
  const path = [tokenIn, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 600;

  const tokenContract = new ethers.Contract(tokenIn, erc20Abi, signer);
  const router = new ethers.Contract(ZK_ROUTER, routerAbi, signer);

  try {
    console.log("Approving token...");
    const approveTx = await tokenContract.approve(ZK_ROUTER, amountIn);
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
    console.log("✅ ZK Swap complete!");
  } catch (err) {
    console.error("ZK Swap Error:", err.message);
    throw err;
  }
}
