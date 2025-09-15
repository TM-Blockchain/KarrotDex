// relayer-thor.js — watch for ThorRequested and settle (skeleton)
import { ethers } from "ethers";
import abi from "./KarrotDexAggregator.abi.json" assert { type: "json" };

const RPC = process.env.RPC_URL;
const PK  = process.env.PRIVATE_KEY;
const AGG = process.env.AGGREGATOR;

const provider = new ethers.JsonRpcProvider(RPC);
const wallet   = new ethers.Wallet(PK, provider);
const agg = new ethers.Contract(AGG, abi, wallet);

agg.on("ThorRequested", async (requestId, user, tokenIn, amountIn, targetChain, memo) => {
  console.log("ThorRequested:", requestId, "amt", amountIn.toString(), "target", targetChain);

  // TODO: call your Thor backend to execute cross-chain swap…

  // When ready to settle on Pulse:
  const to = user;                     // or vault/escrow route
  const tokenOut = "0x...pxAsset";     // e.g., pxBTC or stable
  const amountOut = amountIn;          // demo; apply actual execution result
  const proof = "0x";                  // attach proof if your relayer verifies

  const tx = await agg.settleThorSwap(requestId, to, tokenOut, amountOut, proof);
  await tx.wait();
  console.log("ThorSettled:", requestId, tx.hash);
});
