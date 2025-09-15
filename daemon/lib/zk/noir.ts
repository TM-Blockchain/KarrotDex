// lib/zk/noir.ts
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export async function generateNoirProof(logs: any): Promise<string> {
  // Step 1: Prepare input JSON for the Noir circuit
  const input = {
    user: logs.user,
    assetSymbol: logs.symbol,
    amount: logs.amount
  };
  const inputPath = path.resolve("zk-input.json");
  fs.writeFileSync(inputPath, JSON.stringify(input));

  // Step 2: Run Noir to prove
  execSync("nargo prove", { stdio: "inherit" });

  const proofBuf = fs.readFileSync(path.resolve("target/proof"));
  return "0x" + proofBuf.toString("hex");
}
