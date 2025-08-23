// karrot-logic.js

import { swapPulseX } from './aggregators/pulsex.js';
import { swapRay } from './aggregators/ray.js';
import { swapZK } from './aggregators/zk.js';
import { swap9mm } from './aggregators/9mm.js';
import { swapPiteas } from './aggregators/piteas.js';
import { swapUniswap } from './aggregators/uniswap.js';
import { swapPancakeSwap } from './aggregators/pancake.js';
import { swapCowSwap } from './aggregators/cowswap.js';
import { swap1inch } from './aggregators/oneinch.js';
import { swapMatcha } from './aggregators/matcha.js';
import { swapThorSwap } from './aggregators/thorswap.js';
import { getLibertySwapQuote } from './aggregators/libertyswap.js'; // API-based

// Default aggregator
let selectedAggregator = "PulseX";

// Allows UI to change aggregator
export function setAggregator(name) {
  selectedAggregator = name;
  console.log(`[Aggregator Set] → ${selectedAggregator}`);
}

// Master swap function
export async function executeSwap(tokenIn, tokenOut, amount, userAddr) {
  switch (selectedAggregator) {
    case "PulseX":
      return swapPulseX(tokenIn, tokenOut, amount, userAddr);
    case "Ray":
      return swapRay(tokenIn, tokenOut, amount, userAddr);
    case "ZK":
      return swapZK(tokenIn, tokenOut, amount, userAddr);
    case "9mm":
      return swap9mm(tokenIn, tokenOut, amount, userAddr);
    case "Piteas":
      return swapPiteas(tokenIn, tokenOut, amount, userAddr);
    case "Uniswap":
      return swapUniswap(tokenIn, tokenOut, amount, userAddr);
    case "PancakeSwap":
      return swapPancakeSwap(tokenIn, tokenOut, amount, userAddr);
    case "CowSwap":
      return swapCowSwap(tokenIn, tokenOut, amount, userAddr);
    case "1inch":
      return swap1inch(tokenIn, tokenOut, amount, userAddr);
    case "Matcha":
      return swapMatcha(tokenIn, tokenOut, amount, userAddr);
    case "ThorSwap":
      return swapThorSwap(tokenIn, tokenOut, amount, userAddr);
    case "LibertySwap":
      return getLibertySwapQuote({
        tokenIn,
        tokenOut,
        amount,
        userAddr,
        fromChain: 'ETH',
        toChain: 'ETH',
      });
    default:
      throw new Error("Unknown aggregator: " + selectedAggregator);
  }
}

// 🔁 Update Token Icons Safely
export function updateIcons() {
  const fromMeta = aggregatorTokens[selectedAggregator].find(t => t.address === tokenFrom.value);
  const toMeta = aggregatorTokens[selectedAggregator].find(t => t.address === tokenTo.value);

  fromIcon.src = fromMeta?.logo || "img/default-token.png";
  toIcon.src = toMeta?.logo || "img/default-token.png";

  // Fallback for broken image paths
  fromIcon.onerror = () => { fromIcon.src = "img/default-token.png"; };
  toIcon.onerror = () => { toIcon.src = "img/default-token.png"; };
} 


  // Fallback on load error
  fromIcon.onerror = () => { fromIcon.src = "img/default-token.png"; };
  toIcon.onerror = () => { toIcon.src = "img/default-token.png"; };
