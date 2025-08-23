// daemon/zkproof-relay.ts

import dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import { parseLockEvent } from "../lib/parseLockEvent";
import { generateOrFetchProof } from "../lib/generateProof";

// Setup RPC and minter contract
const provider = new ethers.providers.JsonRpcProvider(process.env.PULSE_RPC);
const minter = new ethers.Contract(
  process.env.MINTER_ADDRESS!,
  [ "function mintFromLockProof(string, address, uint256, bytes)" ],
  new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
);

const seenProofs = new Set<string>();

async function main() {
  console.log("🌀 zkProof Relay Bootstrapping...");

  const eventStream = getZkProofEventStream(); // ⬅️ Your event source (queue, logs, etc.)

  for await (const logs of eventStream) {
    try {
      const proof = generateOrFetchProof(logs);
      const proofHash = ethers.utils.keccak256(proof);
      if (seenProofs.has(proofHash)) continue;
      seenProofs.add(proofHash);

      const { user, symbol, amount } = parseLockEvent(logs);

      console.log(`Relaying: Mint ${symbol} → ${user} for ${amount}`);
      const tx = await minter.mintFromLockProof(symbol, user, amount, proof);
      await tx.wait();

      console.log(`✅ Minted. TX: ${tx.hash}`);
    } catch (err) {
      console.error("❌ zkProof Relay Error:", err);
    }
  }
}

// Mock async stream — replace with real zk queue or proof emitter
async function* getZkProofEventStream() {
  while (true) {
    await new Promise((r) => setTimeout(r, 5000)); // 5s poll
    yield {
      event: "MockAssetLocked",
      data: { user: "0x...", symbol: "pxTOKEN", amount: "1.0" }
    };
  }
}

main().catch((err) => {
  console.error("💥 zkProof Relay Failed:", err);
  process.exit(1);
});
