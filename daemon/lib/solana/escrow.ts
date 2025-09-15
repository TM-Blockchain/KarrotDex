import { PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js";

// Parse AssetLocked event logs from Solana escrow program
export function parseLockEvent(logs: any): { user: string; symbol: string; amount: bigint } {
  // Your logic extracting user, symbol, amount from logs
  return { user: "solUserPubkey", symbol: "pxTOKEN", amount: BigInt(1000000000000000000) };
}
