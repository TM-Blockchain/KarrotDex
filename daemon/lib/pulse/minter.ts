import { ethers } from "ethers";

export function createMinterContract(address: string, abi: any[], provider: ethers.providers.Provider, privateKey: string) {
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(address, abi, wallet);
}

export async function mintFromProof(
  minterContract: ethers.Contract,
  symbol: string,
  user: string,
  amount: bigint,
  proof: string
) {
  const tx = await minterContract.mintFromLockProof(symbol, user, amount, proof);
  return tx.wait();
}

