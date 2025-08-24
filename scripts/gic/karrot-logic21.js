// karrot-logic.js

import { swapPulseX } from './aggregators/pulsex.js';
// Add more imports here as you build them:
// import { swapRay } from './aggregators/ray.js';
// import { swapThorSwap } from './aggregators/thorswap.js';
// import { swapLibertySwap } from './aggregators/libertyswap.js';

let selectedAggregator = "PulseX"; // Can be updated dynamically from UI/config

export function setAggregator(aggregatorName) {
  selectedAggregator = aggregatorName;
}

export async function executeSwap(tokenIn, tokenOut, amount, userAddr) {
  switch (selectedAggregator) {
    case "PulseX":
      return swapPulseX(tokenIn, tokenOut, amount, userAddr);

    // case "Ray":
    //   return swapRay(tokenIn, tokenOut, amount, userAddr);

    // case "ThorSwap":
    //   return swapThorSwap(tokenIn, tokenOut, amount, userAddr);

    // case "LibertySwap":
    //   return swapLibertySwap(tokenIn, tokenOut, amount, userAddr);

    default:
      throw new Error("Unknown aggregator: " + selectedAggregator);
  }
}
