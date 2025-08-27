import { ethers } from "ethers";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { IDL as VaultIDL } from "../target/types/vault_program";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import * as anchor from "@coral-xyz/anchor";

// Setup
const connection = new web3.Connection("https://api.mainnet-beta.solana.com");
const wallet = anchor.Wallet.local(); // use actual agent keypair
const provider = new AnchorProvider(connection, wallet, {});
anchor.setProvider(provider);

const program = new Program(VaultIDL, "YourVaultProgramIDHere", provider);

// Example data
const leaves = [
  keccak256(Buffer.from("user1|100")),
  keccak256(Buffer.from("user2|200")),
];
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const leaf = keccak256(Buffer.from("user1|100"));
const proof = tree.getHexProof(leaf);

async function submitUnlockMerkle() {
  await program.methods
    .unlockWithMerkle(new BN(100), Buffer.from(proof.join("")))
    .accounts({
      user: wallet.publicKey,
      vault: "YourVaultAccountPubkey",
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
}
