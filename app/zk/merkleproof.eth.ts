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
