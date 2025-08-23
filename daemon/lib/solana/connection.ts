import { Connection, PublicKey } from "@solana/web3.js";

export function createSolanaConnection(rpcUrl: string, wsUrl: string): Connection {
  return new Connection(rpcUrl, { wsEndpoint: wsUrl });
}

