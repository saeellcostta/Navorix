/**
 * Price Indexer Service
 *
 * Fetches on-chain pool state for each token and updates token_stats
 * in the Supabase database.
 *
 * Called by the Vercel Cron job at /api/cron/update-stats (every 5 min).
 *
 * Architecture:
 *  1. Fetch all active pools from DB
 *  2. For each pool: read pool accounts from Solana RPC
 *  3. Calculate price, market cap, liquidity
 *  4. Upsert into token_stats table
 *
 * Phase 1 (current): Uses pool reserves stored in DB as source of truth.
 * Phase 2: Replace with direct on-chain RPC reads via getProgramAccounts().
 */

import { Connection } from "@solana/web3.js";
import { SOLANA_RPC_ENDPOINT, LAMPORTS_PER_SOL } from "@/config/solana";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertTokenStats } from "@/services/db/tokenDbService";

/** Approximate SOL price in USD — replace with a price oracle in production */
async function getSolPriceUsd(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );
    const json = await res.json();
    return json?.solana?.usd ?? 145;
  } catch {
    return 145; // fallback
  }
}

export interface IndexerResult {
  updated: number;
  errors:  string[];
}

/**
 * Run one indexer cycle: update stats for all tokens with active pools.
 */
export async function runPriceIndexer(): Promise<IndexerResult> {
  const db = createAdminClient();
  const solUsd = await getSolPriceUsd();
  const errors: string[] = [];
  let updated = 0;

  // Fetch all active pools with token info
  const { data: pools, error: poolsErr } = await db
    .from("pools")
    .select("*, tokens(initial_supply, decimals)")
    .eq("is_active", true);

  if (poolsErr) throw new Error(`Failed to fetch pools: ${poolsErr.message}`);
  if (!pools || pools.length === 0) return { updated: 0, errors: [] };

  for (const pool of pools) {
    try {
      const solReserve   = Number(pool.sol_reserve);
      const tokenReserve = Number(pool.token_reserve);

      if (tokenReserve <= 0) continue;

      // Price: SOL per token → convert to USD
      const priceSol = solReserve / tokenReserve;
      const priceUsd = priceSol * solUsd;

      // Market cap = price × total supply
      const totalSupply  = Number(pool.tokens?.initial_supply ?? 0);
      const marketCapUsd = priceUsd * totalSupply;

      // Liquidity = 2 × SOL reserve (assuming 50/50 pool)
      const liquidityUsd = solReserve * 2 * solUsd;

      await upsertTokenStats({
        mint_address:     pool.mint_address,
        price_usd:        priceUsd,
        price_sol:        priceSol,
        price_change_24h: Number(pool.price_change_24h),
        market_cap_usd:   marketCapUsd,
        volume_24h_usd:   Number(pool.volume_24h_usd),
        liquidity_usd:    liquidityUsd,
      });

      updated++;
    } catch (err) {
      errors.push(
        `${pool.mint_address}: ${err instanceof Error ? err.message : "unknown"}`
      );
    }
  }

  return { updated, errors };
}
