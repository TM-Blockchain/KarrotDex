import { keccak_256 } from "js-sha3";
import { PublicKey } from "@solana/web3.js";

export function hashLeaf(user: PublicKey, amount: number, index: number): Buffer {
  const data = Buffer.concat([
    user.toBuffer(),
    Buffer.from(amount.toString(16).padStart(64, "0"), "hex"),
    Buffer.from(index.toString(16).padStart(64, "0"), "hex"),
  ]);
  return Buffer.from(keccak_256.arrayBuffer(data));
}

export function getMerkleProof(leaves: Buffer[], index: number): Buffer[] {
  let proof: Buffer[] = [];
  let n = leaves.length;
  let level = [...leaves];

  while (n > 1) {
    let nextLevel: Buffer[] = [];

    for (let i = 0; i < n; i += 2) {
      const left = level[i];
      const right = level[i + 1] || left;
      const hash = Buffer.from(keccak_256.arrayBuffer(Buffer.concat([left, right])));
      nextLevel.push(hash);

      if (i === index || i + 1 === index) {
        proof.push(i === index ? right : left);
        index = Math.floor(i / 2);
      }
    }

    level = nextLevel;
    n = level.length;
  }

  return proof;
}
