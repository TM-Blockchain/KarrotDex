import { executeSwap, setAggregator } from './karrot-logic.js';

// Example: select aggregator
setAggregator("PulseX"); // or "LibertySwap", "Uniswap", etc.

const tokenIn = "0xTokenInAddress";        // Replace with real token address
const tokenOut = "0xTokenOutAddress";      // Replace with real token address
const amount = "100";                      // Amount in human-readable format (e.g., "100")
const userAddr = "0xYourWalletAddress";    // Replace with the connected user's wallet address

async function runSwap() {
  try {
    console.log("🔁 Starting swap...");
    const result = await executeSwap(tokenIn, tokenOut, amount, userAddr);
    console.log("✅ Swap result:", result);
  } catch (err) {
    console.error("❌ Swap failed:", err.message);
  }
}

runSwap();
