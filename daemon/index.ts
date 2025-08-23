// KarrotDex/daemon/index.ts

import dotenv from "dotenv";
dotenv.config();

import { startSolanaBridgeDaemon } from "./solana-bridge-daemon";

async function main() {
  console.log("🥕 KarrotDex Daemon Bootstrap");
  console.log("🔄 Initializing Solana ↔ PulseChain Bridge...");

  try {
    await startSolanaBridgeDaemon();
    console.log("✅ Daemon started successfully.");
  } catch (err) {
    console.error("❌ Failed to start daemon:", err);
    process.exit(1);
  }
}

main();
