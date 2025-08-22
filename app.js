import { executeSwap, setAggregator } from './karrot-logic.js';

setAggregator("Piteas");

const quote = await executeSwap(
  "0xTokenInAddress",
  "0xTokenOutAddress",
  "100", // as string
  "0xUserWalletAddress"
);
