// index.js

import { executeSwap, setAggregator } from './karrot-logic.js';

// Replace these with real token addresses and wallet address
const tokenIn = "0xYourInputTokenAddress";
const tokenOut = "0xYourOutputTokenAddress";
const amount = "100"; // in token units (assumes 18 decimals)
const userAddr = "0xYourWalletAddress";

async function runSwap() {
  try {
    setAggregator("LibertySwap"); // or "PulseX", etc.

    const result = await executeSwap(tokenIn, tokenOut, amount, userAddr);
    console.log("Swap Result:", result);
  } catch (err) {
    console.error("Swap Failed:", err.message);
  }
}

runSwap();
