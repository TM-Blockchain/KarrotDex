import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { groth16 } from 'snarkjs';
import fs from 'fs';
import { ethers } from 'ethers';

interface LockEvent {
  user: string;
  amount: bigint;
  symbol: string;
  nonce: number;
}

interface ProofInputs {
  leaf: string;
  root: string;
  pathElements: string[];
  pathIndices: number[];
}

function hashLeaf(event: LockEvent): Buffer {
  const packed = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256', 'string', 'uint256'],
    [event.user, event.amount, event.symbol, event.nonce]
  );
  return keccak256(packed);
}

function generateMerkleTree(events: LockEvent[]): { tree: MerkleTree; leaves: Buffer[] } {
  const leaves = events.map(hashLeaf);
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  return { tree, leaves };
}

async function generateZKProof(
  input: ProofInputs,
  wasmPath: string,
  zkeyPath: string
): Promise<{ proof: any; publicSignals: any }> {
  const { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);
  return { proof, publicSignals };
}

function getProofInput(event: LockEvent, tree: MerkleTree): ProofInputs {
  const leaf = hashLeaf(event);
  const proof = tree.getProof(leaf);
  const root = tree.getRoot().toString('hex');

  const pathElements = proof.map(p => p.data.toString('hex'));
  const pathIndices = proof.map(p => (p.position === 'right' ? 1 : 0));

  return {
    leaf: leaf.toString('hex'),
    root,
    pathElements,
    pathIndices,
  };
}

async function submitUnlockProof(
  zkProof: any,
  publicSignals: any,
  event: LockEvent,
  contractAddress: string,
  abi: any,
  providerUrl: string,
  privateKey: string
) {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const tx = await contract.unlockWithZKProof(
    event.user,
    event.symbol,
    event.amount,
    publicSignals,
    zkProof
  );

  console.log('✅ Unlock TX sent:', tx.hash);
  await tx.wait();
  console.log('🎉 Unlock confirmed.');
}
