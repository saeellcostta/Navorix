import { clusterApiUrl } from "@solana/web3.js";
import type { WalletNetwork } from "@/types/wallet";

export const SOLANA_NETWORK: WalletNetwork =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletNetwork) ?? "devnet";

export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl(SOLANA_NETWORK);

export const SOLANA_COMMITMENT = "confirmed" as const;

/** Lamports per SOL */
export const LAMPORTS_PER_SOL = 1_000_000_000;

/** Platform fee for token creation: 0.02 SOL */
export const TOKEN_CREATION_FEE_SOL = 0.02;

/** Platform trade fee: 1% */
export const TRADE_FEE_PCT = 0.01;

/** Default slippage tolerance: 1% */
export const DEFAULT_SLIPPAGE_PCT = 0.01;

/** Max slippage tolerance: 50% */
export const MAX_SLIPPAGE_PCT = 0.5;

/** Metaplex token metadata program ID */
export const TOKEN_METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

/**
 * Navorix fee collector wallet.
 * All token creation fees (0.02 SOL) and trade fees (1%) flow here.
 * Can be overridden via NEXT_PUBLIC_FEE_WALLET env variable.
 */
export const FEE_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_FEE_WALLET ?? "FvmN4BnLKR25QWXXoLof2RZFzwC8XU3QLcPr1aJg1UvQ";
