// app.js
import { executeSwap, setAggregator } from './karrot-logic.js';

// 🛠 Dummy data to simulate a swap
const tokenIn = "0xYourInputTokenAddress";
const tokenOut = "0xYourOutputTokenAddress";
const amount = "1.5"; // In tokens, like "1.5"
const userAddr = "0xYourWalletAddress"; // User wallet address

async function doSwap() {
  try {
    // Choose which aggregator to use
    setAggregator("PulseX");

    // Perform the swap
    await executeSwap(tokenIn, tokenOut, amount, userAddr);

    console.log("Swap complete");
  } catch (err) {
    console.error("Swap failed:", err.message);
  }
}

// Call the function
doSwap();
