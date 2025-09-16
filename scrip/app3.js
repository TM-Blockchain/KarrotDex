// app.js

import { executeSwap, setAggregator } from './karrot-logic.js';

// --- Known Router Constants ---
const ROUTERS = {
  PulseX: "0x165C3410fC91EF562C50559f7d2289fEbed552d9", // confirmed :contentReference[oaicite:1]{index=1}
  Piteas: "0xPiteasRouterAddressHere",                 // replace with actual when available
  Ray: "0xRayRouterAddressHere",                       // pending confirmation
  ZK: "0xZkRouterAddressHere",                         // pending confirmation
  "9mm": "0x9mmRouterAddressHere",                     // pending confirmation
  Uniswap: null,  // Ethereum
  PancakeSwap: null, // BSC
  CowSwap: null, // Off-chain
  "1inch": null,
  Matcha: null,
  ThorSwap: null,
  LibertySwap: null
};

// --- Example Swap Parameters (replace with real addresses and amounts) ---
const tokenIn = "0xYourInputTokenAddress";     // e.g. DAI or USDC on PulseChain
const tokenOut = "0xYourOutputTokenAddress";   // e.g. KARROT or HEX on PulseChain
const amount = "100";                          // e.g. "100"
const userAddr = "0xYourWalletAddress";        // user's wallet address (e.g., MetaMask)

// --- Choose Which Aggregator to Use ---
setAggregator("PulseX"); // defaults to PulseX for now

// Optionally, log the router you're targeting
console.log("Using router:", ROUTERS[selectedAggregator]);

async function runSwap() {
  try {
    console.log("🔁 Initiating swap...");
    const result = await executeSwap(tokenIn, tokenOut, amount, userAddr);
    console.log("✅ Swap Result:", result);
  } catch (err) {
    console.error("❌ Swap failed:", err.message);
  }
}

// Execute immediately (or trigger from UI)
runSwap();
