/**
 * Price Indexer Service
 *
 * Fetches real market data from DexScreener API for each token
 * and updates token_stats in the Supabase database.
 *
 * Called by the Vercel Cron job at /api/cron/update-stats (every 5 min).
 *
 * Data sources (in priority order):
 *  1. DexScreener API — real on-chain pool data (price, mcap, volume, liquidity)
 *  2. Pool reserves from DB — fallback for tokens not yet on DexScreener
 */

import { LAMPORTS_PER_SOL } from "@/config/solana";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertTokenStats } from "@/services/db/tokenDbService";

// ─── DexScreener Types ───────────────────────────────────────

interface DexScreenerPair {
  chainId:        string;
  dexId:          string;
  pairAddress:    string;
  baseToken:      { address: string; name: string; symbol: string };
  quoteToken:     { address: string; symbol: string };
  priceNative:    string;
  priceUsd?:      string;
  txns:           { h24: { buys: number; sells: number } };
  volume:         { h24: number };
  priceChange:    { h24: number };
  liquidity?:     { usd: number };
  fdv?:           number;
  marketCap?:     number;
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[] | null;
}

/**
 * Fetch token data from DexScreener for a given mint address.
 * Returns the most liquid Solana pair found.
 */
async function fetchDexScreenerData(mintAddress: string): Promise<DexScreenerPair | null> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data: DexScreenerResponse = await res.json();
    if (!data.pairs || data.pairs.length === 0) return null;

    // Filter Solana pairs only, pick most liquid
    const solanaPairs = data.pairs.filter(p => p.chainId === "solana");
    if (solanaPairs.length === 0) return null;

    return solanaPairs.sort((a, b) =>
      (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
    )[0];
  } catch {
    return null;
  }
}

/** Approximate SOL price in USD */
async function getSolPriceUsd(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );
    const json = await res.json();
    return json?.solana?.usd ?? 145;
  } catch {
    return 145;
  }
}

export interface IndexerResult {
  updated:      number;
  fromDex:      number;
  fromReserves: number;
  errors:       string[];
}

/**
 * Run one indexer cycle: update stats for all tokens.
 */
export async function runPriceIndexer(): Promise<IndexerResult> {
  const db = createAdminClient();
  const solUsd = await getSolPriceUsd();
  const errors: string[] = [];
  let updated = 0;
  let fromDex = 0;
  let fromReserves = 0;

  // Fetch all tokens (not just those with pools)
  const { data: tokens, error: tokensErr } = await db
    .from("tokens")
    .select("mint_address, initial_supply, decimals");

  if (tokensErr) throw new Error(`Failed to fetch tokens: ${tokensErr.message}`);
  if (!tokens || tokens.length === 0) return { updated: 0, fromDex: 0, fromReserves: 0, errors: [] };

  // Also fetch pools for fallback
  const { data: pools } = await db
    .from("pools")
    .select("mint_address, sol_reserve, token_reserve, price_change_24h, volume_24h_usd")
    .eq("is_active", true);

  const poolMap = new Map(pools?.map(p => [p.mint_address, p]) ?? []);

  // Process tokens in batches of 5 to avoid rate limiting
  const BATCH = 5;
  for (let i = 0; i < tokens.length; i += BATCH) {
    const batch = tokens.slice(i, i + BATCH);

    await Promise.all(batch.map(async (token) => {
      try {
        const dex = await fetchDexScreenerData(token.mint_address);

        if (dex && dex.priceUsd) {
          // ✅ DexScreener data available — use real market data
          const priceUsd    = parseFloat(dex.priceUsd);
          const priceSol    = priceUsd / solUsd;
          const marketCap   = dex.marketCap ?? dex.fdv ?? priceUsd * Number(token.initial_supply ?? 0);
          const volume24h   = dex.volume?.h24 ?? 0;
          const liquidity   = dex.liquidity?.usd ?? 0;
          const change24h   = dex.priceChange?.h24 ?? 0;
          const txCount24h  = (dex.txns?.h24?.buys ?? 0) + (dex.txns?.h24?.sells ?? 0);

          await upsertTokenStats({
            mint_address:     token.mint_address,
            price_usd:        priceUsd,
            price_sol:        priceSol,
            price_change_24h: change24h,
            market_cap_usd:   marketCap,
            volume_24h_usd:   volume24h,
            liquidity_usd:    liquidity,
            tx_count_24h:     txCount24h,
          });

          fromDex++;
          updated++;
        } else {
          // 📊 Fallback: use pool reserves from DB
          const pool = poolMap.get(token.mint_address);
          if (!pool) return;

          const solReserve   = Number(pool.sol_reserve);
          const tokenReserve = Number(pool.token_reserve);
          if (tokenReserve <= 0) return;

          const priceSol     = solReserve / tokenReserve;
          const priceUsd     = priceSol * solUsd;
          const totalSupply  = Number(token.initial_supply ?? 0);
          const marketCapUsd = priceUsd * totalSupply;
          const liquidityUsd = solReserve * 2 * solUsd;

          await upsertTokenStats({
            mint_address:     token.mint_address,
            price_usd:        priceUsd,
            price_sol:        priceSol,
            price_change_24h: Number(pool.price_change_24h ?? 0),
            market_cap_usd:   marketCapUsd,
            volume_24h_usd:   Number(pool.volume_24h_usd ?? 0),
            liquidity_usd:    liquidityUsd,
          });

          fromReserves++;
          updated++;
        }
      } catch (err) {
        errors.push(
          `${token.mint_address}: ${err instanceof Error ? err.message : "unknown"}`
        );
      }
    }));

    // Small delay between batches to respect rate limits
    if (i + BATCH < tokens.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return { updated, fromDex, fromReserves, errors };
}
