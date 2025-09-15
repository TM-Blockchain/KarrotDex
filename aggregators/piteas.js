// aggregators/piteas.js

import { ethers } from "ethers";

const PITEAS_ROUTER = "0xYourPiteasRouterAddress"; // <-- Replace with actual Piteas router address

const routerAbi = [
  "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)"
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

export async function swapPiteas(tokenIn, tokenOut, amount, userAddr) {
  console.log("Swapping on Piteas:", { tokenIn, tokenOut, amount, userAddr });

  if (!window.ethereum) throw new Error("No wallet provider found");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const amountIn = ethers.utils.parseUnits(amount.toString(), 18);
  const slippagePct = 0.005; // 0.5% slippage
  const amountOutMin = amountIn.mul(995).div(1000);
  const path = [tokenIn, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now

  const tokenContract = new ethers.Contract(tokenIn, erc20Abi, signer);
  const router = new ethers.Contract(PITEAS_ROUTER, routerAbi, signer);

  try {
    console.log("Approving token...");
    const approveTx = await tokenContract.approve(PITEAS_ROUTER, amountIn);
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
    console.log("Swap complete!");
  } catch (err) {
    console.error("Piteas Swap Error:", err.message);
    throw err;
  }
}
