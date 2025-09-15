import { ethers } from "ethers";

export function generateOrFetchProof(logs: any): string {
  const proof = Buffer.from(JSON.stringify(logs));
  return "0x" + proof.toString("hex");
}

export function computeProofHash(proof: string): string {
  return ethers.utils.keccak256(proof);
}

