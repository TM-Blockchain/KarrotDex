import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getMerkleProof, hashLeaf } from "./merkleUtils"; // helper module
import idl from "../target/idl/your_anchor_program.json";

const PROGRAM_ID = new PublicKey("YourProgramIdHere");
const connection = new Connection("https://api.mainnet-beta.solana.com");
const wallet = new Wallet(Keypair.fromSecretKey(/* your key */));
const provider = new AnchorProvider(connection, wallet, {});
const program = new Program(idl as any, PROGRAM_ID, provider);

export async function submitUnlockWithMerkle({
  user,
  assetMint,
  vault,
  amount,
  leafIndex,
  leaves,
}: {
  user: PublicKey;
  assetMint: PublicKey;
  vault: PublicKey;
  amount: bigint;
  leafIndex: number;
  leaves: Buffer[];
}) {
  // Build Merkle tree
  const proof = getMerkleProof(leaves, leafIndex);

  // Hash the leaf
  const leaf = hashLeaf(user, amount, leafIndex);

  await program.methods
    .unlockWithMerkle(leaf, proof, new anchor.BN(amount), new anchor.BN(leafIndex))
    .accounts({
      user,
      vault,
      assetMint,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  console.log("✅ Unlock submitted with Merkle proof");
}
