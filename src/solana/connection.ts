import { Connection } from "@solana/web3.js";
import { SOLANA_RPC_ENDPOINT, SOLANA_COMMITMENT } from "@/config/solana";

let _connection: Connection | null = null;

/**
 * Returns a singleton Solana RPC connection.
 * Uses the configured RPC endpoint and commitment level.
 */
export function getConnection(): Connection {
  if (!_connection) {
    _connection = new Connection(SOLANA_RPC_ENDPOINT, SOLANA_COMMITMENT);
  }
  return _connection;
}
