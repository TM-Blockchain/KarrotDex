// daemon/zkproof-relay.ts

import { ethers } from "ethers";
import { parseLockEvent } from "../lib/parseLockEvent";
import { generateOrFetchProof } from "../lib/generateProof";

// Setup RPC and contracts
const pulseProvider = new ethers.providers.JsonRpcProvider(process.env.PULSE_RPC);
const minter = new ethers.Contract(
  process.env.MINTER_ADDRESS!,
  [ "function mintFromLockProof(string, address, uint256, bytes)" ],
  new ethers.Wallet(process.env.PRIVATE_KEY!, pulseProvider)
);

const seenProofs = new Set<string>();

export async function startZkProofRelay() {
  console.log("🌀 ZK Proof Relay Started...");

  // Example: Read logs from an event stream or queue
  // Replace with your actual event source
  const eventSource = getZkProofEventStream();

  for await (const logs of eventSource) {
    try {
      const proof = generateOrFetchProof(logs);
      const proofHash = ethers.utils.keccak256(proof);

      if (seenProofs.has(proofHash)) continue;
      seenProofs.add(proofHash);

      const { user, symbol, amount } = parseLockEvent(logs);

      console.log(`Relaying zkProof: minting ${symbol} to ${user}, amount: ${amount}`);
      const tx = await minter.mintFromLockProof(symbol, user, amount, proof);
      await tx.wait();

      console.log(`✅ Mint TX: ${tx.hash}`);
    } catch (err) {
      console.error("❌ ZK Relay Error:", err);
    }
  }
}

// Mock of zk event source — replace with your real stream
async function* getZkProofEventStream() {
  while (true) {
    await new Promise(res => setTimeout(res, 5000));
    yield { /* mocked zk logs */ };
  }
}
