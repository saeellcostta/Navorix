/**
 * Token database service — all Supabase queries for tokens.
 * Used exclusively in API Route Handlers (server-side).
 * Never import this in Client Components.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type { TokenListItem, Token } from "@/types/token";
import type { Database } from "@/lib/supabase/types";

type TokenRow       = Database["public"]["Tables"]["tokens"]["Row"];
type TokenStatsRow  = Database["public"]["Tables"]["token_stats"]["Row"];
type TokenInsert    = Database["public"]["Tables"]["tokens"]["Insert"];
type StatsInsert    = Database["public"]["Tables"]["token_stats"]["Insert"];

export type SortOption = "trending" | "new" | "marketcap" | "volume";

/** Map a DB row (+ optional stats join) to the shared TokenListItem shape */
function rowToTokenListItem(
  row: TokenRow & { token_stats?: TokenStatsRow | null },
  rank?: number
): TokenListItem {
  const stats = row.token_stats ?? null;
  const now   = Date.now();
  const createdMs = new Date(row.created_at).getTime();
  const isNew = now - createdMs < 24 * 60 * 60 * 1000;

  return {
    mintAddress:  row.mint_address,
    name:         row.name,
    symbol:       row.symbol,
    description:  row.description ?? "",
    imageUrl:     row.image_url ?? "",
    decimals:     row.decimals,
    supply:       Number(row.initial_supply),
    creator:      row.creator_wallet,
    createdAt:    new Date(row.created_at),
    rank,
    isNew,
    isTrending:   rank !== undefined && rank <= 10,
    stats: stats
      ? {
          price:          Number(stats.price_usd),
          priceChange24h: Number(stats.price_change_24h),
          marketCap:      Number(stats.market_cap_usd),
          volume24h:      Number(stats.volume_24h_usd),
          holders:        stats.holders,
          liquidity:      Number(stats.liquidity_usd),
          txCount24h:     stats.tx_count_24h,
        }
      : undefined,
  };
}

/** Map a DB row to the full Token detail shape */
function rowToToken(row: TokenRow & { token_stats?: TokenStatsRow | null }): Token {
  return rowToTokenListItem(row) as Token;
}

// ─────────────────────────────────────────────────────────
//  READ
// ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of tokens, with stats joined.
 */
export async function getTokens(opts: {
  sort?: SortOption;
  limit?: number;
  offset?: number;
}): Promise<TokenListItem[]> {
  const { sort = "trending", limit = 20, offset = 0 } = opts;
  const db = createAdminClient();

  const sortColumnMap: Record<SortOption, string> = {
    trending:  "token_stats.volume_24h_usd", // approximation; real trending uses view
    new:       "created_at",
    marketcap: "token_stats.market_cap_usd",
    volume:    "token_stats.volume_24h_usd",
  };

  // Use the tokens_trending view for trending sort (real 24h volume score)
  if (sort === "trending") {
    const { data, error } = await db
      .from("tokens_trending")
      .select("*")
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`getTokens(trending): ${error.message}`);

    return (data ?? []).map((row: Record<string, unknown>, i: number) =>
      rowToTokenListItem(
        row as unknown as TokenRow & { token_stats: TokenStatsRow | null },
        offset + i + 1
      )
    );
  }

  let query = db
    .from("tokens")
    .select("*, token_stats(*)")
    .range(offset, offset + limit - 1);

  if (sort === "new") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(`getTokens: ${error.message}`);

  return (data ?? []).map((row, i) =>
    rowToTokenListItem(
      row as TokenRow & { token_stats: TokenStatsRow | null },
      offset + i + 1
    )
  );
}

/**
 * Fetch a single token by mint address.
 */
export async function getTokenByMint(mintAddress: string): Promise<Token | null> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("tokens")
    .select("*, token_stats(*)")
    .eq("mint_address", mintAddress)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`getTokenByMint: ${error.message}`);
  }

  return rowToToken(data as TokenRow & { token_stats: TokenStatsRow | null });
}

// ─────────────────────────────────────────────────────────
//  WRITE
// ─────────────────────────────────────────────────────────

/**
 * Insert a newly created token (called after on-chain confirmation).
 */
export async function insertToken(input: TokenInsert): Promise<Token> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("tokens")
    .insert(input)
    .select("*, token_stats(*)")
    .single();

  if (error) throw new Error(`insertToken: ${error.message}`);

  // Bootstrap empty stats row
  await db.from("token_stats").upsert(
    { mint_address: input.mint_address } satisfies StatsInsert,
    { onConflict: "mint_address" }
  );

  return rowToToken(data as TokenRow & { token_stats: TokenStatsRow | null });
}

/**
 * Upsert live token stats (called by the off-chain indexer / cron job).
 */
export async function upsertTokenStats(stats: StatsInsert): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("token_stats")
    .upsert({ ...stats, updated_at: new Date().toISOString() }, { onConflict: "mint_address" });

  if (error) throw new Error(`upsertTokenStats: ${error.message}`);
}

/**
 * Upsert or create a user record by wallet address.
 */
export async function upsertUser(walletAddress: string): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("users")
    .upsert({ wallet_address: walletAddress }, { onConflict: "wallet_address" });

  if (error) throw new Error(`upsertUser: ${error.message}`);
}
