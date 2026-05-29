import { clusterApiUrl } from "@solana/web3.js";
import type { WalletNetwork } from "@/types/wallet";

export const SOLANA_NETWORK: WalletNetwork =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletNetwork) ?? "devnet";

// Use || (not ??) so empty strings also fall back to the public RPC
export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK);

export const SOLANA_COMMITMENT = "confirmed" as const;

/** Lamports per SOL */
export const LAMPORTS_PER_SOL = 1_000_000_000;

// ─────────────────────────────────────────────
//  TOKEN CREATION FEES
// ─────────────────────────────────────────────

export const TOKEN_CREATION_FEE_SOL = 0.02;

export const SOL_BUYS_PCT_OF_SUPPLY = 0.10;

export const TOKENS_PER_SOL_AT_LAUNCH = 100_000_000;

export const INITIAL_BUY_PRESETS_SOL = [0.1, 0.25, 0.5, 1] as const;

export const MIN_INITIAL_BUY_SOL = 0;

export const MAX_INITIAL_BUY_SOL = 10;

// ─────────────────────────────────────────────
//  TRADE FEES
// ─────────────────────────────────────────────

export const TRADE_FEE_PCT = 0.01;

export const DEFAULT_SLIPPAGE_PCT = 0.01;

export const MAX_SLIPPAGE_PCT = 0.5;

// ─────────────────────────────────────────────
//  PROGRAM IDs
// ─────────────────────────────────────────────

export const TOKEN_METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

/**
 * Navorix fee collector wallet.
 * Receives: token creation fees (0.02 SOL fixed) + initial buy SOL + 1% trade fees.
 */
export const FEE_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_FEE_WALLET ?? "HJPWGNNCMwbEGWhvjHGMFHaYCL92HpnyuYcJ2ZJCuDqb";

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

export function solToTokensAtLaunch(sol: number, supply = 1_000_000_000): number {
  const tokensPerSol = supply * SOL_BUYS_PCT_OF_SUPPLY;
  return Math.floor(sol * tokensPerSol);
}

export function getTokensPerSol(supply: number): number {
  return Math.floor(supply * SOL_BUYS_PCT_OF_SUPPLY);
}

export function totalLaunchCostSol(initialBuySol: number): number {
  return TOKEN_CREATION_FEE_SOL + initialBuySol;
}
