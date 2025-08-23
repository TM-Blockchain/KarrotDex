// app.js
import { executeSwap, setAggregator } from './karrot-logic.js';
import { state } from './state.js'; // 🧠 This is where selectedAggregator lives

// --- Known Router Constants ---
const ROUTERS = {
  PulseX: "0x165C3410fC91EF562C50559f7d2289fEbed552d9",
  Piteas: "0xPiteasRouterAddressHere",
  Ray: "0xRayRouterAddressHere",
  ZK: "0xZkRouterAddressHere",
  "9mm": "0x9mmRouterAddressHere",
  Uniswap: null,
  PancakeSwap: null,
  CowSwap: null,
  "1inch": null,
  Matcha: null,
  ThorSwap: null,
  LibertySwap: null
};

// --- Choose Which Aggregator to Use ---
setAggregator("PulseX"); // this should internally update state.selectedAggregator

// Log router now that state has been updated
console.log("Using router:", ROUTERS[state.selectedAggregator]);

// --- Example Swap Parameters (replace with real addresses and values) ---
const tokenIn = "0xYourInputTokenAddress";      // e.g. DAI
const tokenOut = "0xYourOutputTokenAddress";    // e.g. KARROT
const amount = "100";                           // amount in human-readable format
const userAddr = "0xYourWalletAddress";         // user’s wallet address

async function runSwap() {
  try {
    console.log("🔁 Initiating swap...");
    const result = await executeSwap(tokenIn, tokenOut, amount, userAddr);
    console.log("✅ Swap Result:", result);
  } catch (err) {
    console.error("❌ Swap failed:", err.message);
  }
}

// Auto-run swap or hook into UI
runSwap();
