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

/**
 * Fixed platform fee charged on every token creation.
 * Sent to FEE_WALLET_ADDRESS before the mint is created.
 */
export const TOKEN_CREATION_FEE_SOL = 0.02;

/**
 * Percentual do supply que 1 SOL compra no lançamento.
 * 1 SOL = 10% do supply total.
 *
 * Exemplos:
 *   Supply 1M  → 1 SOL = 100K tokens
 *   Supply 1B  → 1 SOL = 100M tokens
 *   Supply 1T  → 1 SOL = 100B tokens
 */
export const SOL_BUYS_PCT_OF_SUPPLY = 0.10; // 10%

/** Valor padrão para supply 1B (usado como fallback) */
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
 * @param sol SOL amount
 * @param supply Total token supply (default 1B)
 */
export function solToTokensAtLaunch(sol: number, supply = 1_000_000_000): number {
  const tokensPerSol = supply * SOL_BUYS_PCT_OF_SUPPLY;
  return Math.floor(sol * tokensPerSol);
}

/**
 * How many tokens 1 SOL buys for a given supply.
 */
export function getTokensPerSol(supply: number): number {
  return Math.floor(supply * SOL_BUYS_PCT_OF_SUPPLY);
}

/**
 * Calculate the total SOL cost for a token launch:
 *   platform creation fee  +  optional initial buy
 */
export function totalLaunchCostSol(initialBuySol: number): number {
  return TOKEN_CREATION_FEE_SOL + initialBuySol;
}
