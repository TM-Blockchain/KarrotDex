// karrot-logic-v19.js

import { swapPulseX } from './aggregators/pulsex.js';
import { swapRay } from './aggregators/ray.js';
import { swapZK } from './aggregators/zk.js';
import { swap9mm } from './aggregators/9mm.js';
import { swapPiteas } from './aggregators/piteas.js';
import { swapUniswap } from './aggregators/uniswap.js';
import { swapPancakeSwap } from './aggregators/pancakeswap.js';
import { swapCowSwap } from './aggregators/cowswap.js';
import { swap1inch } from './aggregators/1inch.js';
import { swapMatcha } from './aggregators/matcha.js';
import { swapThorSwap } from './aggregators/thorswap.js';
import { swapLibertySwap } from './libertyswap.js';

let selectedAggregator = "PulseX"; // Default

export function setSelectedAggregator(name) {
  selectedAggregator = name;
}

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
      return swapLibertySwap(tokenIn, tokenOut, amount, userAddr);
    default:
      throw new Error("Unknown aggregator: " + selectedAggregator);
  }
}
