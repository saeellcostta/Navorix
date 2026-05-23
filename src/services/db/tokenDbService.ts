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
  const r   = row as Record<string, unknown>;
  const now = Date.now();
  const createdMs = new Date(row.created_at).getTime();
  const isNew = now - createdMs < 24 * 60 * 60 * 1000;

  // Suporte a duas formas:
  // 1. row com token_stats joinado (tabela tokens + join)
  // 2. row achatado da view tokens_trending (campos direto na row)
  const stats = row.token_stats ?? null;

  const price          = stats ? Number(stats.price_usd)         : Number(r.price_usd         ?? 0);
  const priceChange24h = stats ? Number(stats.price_change_24h)  : Number(r.price_change_24h  ?? 0);
  const marketCap      = stats ? Number(stats.market_cap_usd)    : Number(r.market_cap_usd    ?? 0);
  const volume24h      = stats ? Number(stats.volume_24h_usd)    : Number(r.volume_24h_usd    ?? 0);
  const holders        = stats ? stats.holders                   : Number(r.holders            ?? 0);
  const liquidity      = stats ? Number(stats.liquidity_usd)     : Number(r.liquidity_usd     ?? 0);
  const txCount24h     = stats ? stats.tx_count_24h              : Number(r.tx_count_24h       ?? 0);

  return {
    mintAddress:  row.mint_address,
    name:         row.name,
    symbol:       row.symbol,
    description:  row.description ?? "",
    imageUrl:     (r.image_url  as string) ?? "",
    bannerUrl:    (r.banner_url as string) ?? "",
    decimals:     row.decimals,
    supply:       Number(row.initial_supply),
    creator:      row.creator_wallet,
    createdAt:    new Date(row.created_at),
    social: {
      twitter:  (r.twitter_url  as string) ?? "",
      telegram: (r.telegram_url as string) ?? "",
      website:  (r.website_url  as string) ?? "",
      discord:  (r.discord_url  as string) ?? "",
    },
    rank,
    isNew,
    isTrending: rank !== undefined && rank <= 10,
    stats: {
      price,
      priceChange24h,
      marketCap,
      volume24h,
      holders,
      liquidity,
      txCount24h,
    },
  };
}

/** Map a DB row to the full Token detail shape */
function rowToToken(row: TokenRow & { token_stats?: TokenStatsRow | null }): Token {
  return rowToTokenListItem(row) as Token;
}

// ─────────────────────────────────────────────────────────
//  READ
// ─────────────────────────────────────────────────────────

export async function getTokens(opts: {
  sort?: SortOption;
  limit?: number;
  offset?: number;
}): Promise<TokenListItem[]> {
  const { sort = "trending", limit = 20, offset = 0 } = opts;
  const db = createAdminClient();

  // View achatada para trending
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

  const ascending = false;
  const { data, error } = await db
    .from("tokens")
    .select("*, token_stats(*)")
    .order("created_at", { ascending })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`getTokens: ${error.message}`);

  return (data ?? []).map((row, i) =>
    rowToTokenListItem(
      row as TokenRow & { token_stats: TokenStatsRow | null },
      offset + i + 1
    )
  );
}

export async function getTokenByMint(mintAddress: string): Promise<Token | null> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("tokens")
    .select("*, token_stats(*)")
    .eq("mint_address", mintAddress)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`getTokenByMint: ${error.message}`);
  }

  return rowToToken(data as TokenRow & { token_stats: TokenStatsRow | null });
}

// ─────────────────────────────────────────────────────────
//  WRITE
// ─────────────────────────────────────────────────────────

export async function insertToken(input: TokenInsert): Promise<Token> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("tokens")
    .insert(input)
    .select("*, token_stats(*)")
    .single();

  if (error) throw new Error(`insertToken: ${error.message}`);

  await db.from("token_stats").upsert(
    { mint_address: input.mint_address } satisfies StatsInsert,
    { onConflict: "mint_address" }
  );

  return rowToToken(data as TokenRow & { token_stats: TokenStatsRow | null });
}

export async function upsertTokenStats(stats: StatsInsert): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("token_stats")
    .upsert({ ...stats, updated_at: new Date().toISOString() }, { onConflict: "mint_address" });

  if (error) throw new Error(`upsertTokenStats: ${error.message}`);
}

export async function upsertUser(walletAddress: string): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("users")
    .upsert({ wallet_address: walletAddress }, { onConflict: "wallet_address" });

  if (error) throw new Error(`upsertUser: ${error.message}`);
}
