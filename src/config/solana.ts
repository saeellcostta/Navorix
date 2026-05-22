import { clusterApiUrl } from "@solana/web3.js";
import type { WalletNetwork } from "@/types/wallet";

export const SOLANA_NETWORK: WalletNetwork =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletNetwork) ?? "devnet";

export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl(SOLANA_NETWORK);

export const SOLANA_COMMITMENT = "confirmed" as const;

/** Lamports per SOL */
export const LAMPORTS_PER_SOL = 1_000_000_000;

// ─────────────────────────────────────────────
//  TOKEN CREATION FEES
// ─────────────────────────────────────────────

/**
 * Fixed platform fee charged on every token creation.
 * Sent to FEE_WALLET_ADDRESS before the mint is created.
 */
export const TOKEN_CREATION_FEE_SOL = 0.02;

/**
 * Initial buy pricing: how many tokens the creator receives per 1 SOL
 * when doing the optional pre-buy at launch.
 *
 * Rate: 1 SOL → 100,000,000 tokens (100 million)
 *
 * Examples:
 *   0.01 SOL → 1,000,000  tokens (1 million)
 *   0.1  SOL → 10,000,000 tokens (10 million)
 *   0.25 SOL → 25,000,000 tokens (25 million)
 *   0.5  SOL → 50,000,000 tokens (50 million)
 *   1    SOL → 100,000,000 tokens (100 million)
 */
export const TOKENS_PER_SOL_AT_LAUNCH = 100_000_000;

/**
 * Pre-set SOL amounts shown as quick-select buttons in the initial buy panel.
 * Mirrors the Pump.fun UX but with Navorix pricing.
 */
export const INITIAL_BUY_PRESETS_SOL = [0.1, 0.25, 0.5, 1] as const;

/** Minimum initial buy (user can skip by leaving 0) */
export const MIN_INITIAL_BUY_SOL = 0;

/** Maximum initial buy in one transaction */
export const MAX_INITIAL_BUY_SOL = 10;

// ─────────────────────────────────────────────
//  TRADE FEES
// ─────────────────────────────────────────────

/** Platform trade fee: 1% of every buy/sell */
export const TRADE_FEE_PCT = 0.01;

/** Default slippage tolerance: 1% */
export const DEFAULT_SLIPPAGE_PCT = 0.01;

/** Max slippage tolerance: 50% */
export const MAX_SLIPPAGE_PCT = 0.5;

// ─────────────────────────────────────────────
//  PROGRAM IDs
// ─────────────────────────────────────────────

/** Metaplex token metadata program ID */
export const TOKEN_METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

/**
 * Navorix fee collector wallet.
 * Receives: token creation fees (0.02 SOL fixed) + initial buy SOL + 1% trade fees.
 */
export const FEE_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_FEE_WALLET ?? "FvmN4BnLKR25QWXXoLof2RZFzwC8XU3QLcPr1aJg1UvQ";

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

/**
 * Calculate how many tokens a given SOL amount buys at launch rate.
 * Uses integer math to avoid floating-point drift.
 */
export function solToTokensAtLaunch(sol: number): number {
  return Math.floor(sol * TOKENS_PER_SOL_AT_LAUNCH);
}

/**
 * Calculate the total SOL cost for a token launch:
 *   platform creation fee  +  optional initial buy
 */
export function totalLaunchCostSol(initialBuySol: number): number {
  return TOKEN_CREATION_FEE_SOL + initialBuySol;
}
