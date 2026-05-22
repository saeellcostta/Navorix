/**
 * Pool database service — all Supabase queries for liquidity pools.
 * Server-side only.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type { LiquidityPool } from "@/types/pool";
import type { Database } from "@/lib/supabase/types";

type PoolRow  = Database["public"]["Tables"]["pools"]["Row"];
type TokenRow = Database["public"]["Tables"]["tokens"]["Row"];

function rowToPool(
  row: PoolRow & { tokens?: TokenRow | null }
): LiquidityPool {
  const token = row.tokens ?? null;
  return {
    id:              row.id,
    raydiumPoolId:   row.raydium_pool_id ?? null,
    tokenMint:       row.mint_address,
    tokenSymbol:     token?.symbol ?? "",
    tokenName:       token?.name ?? "",
    tokenImageUrl:   token?.image_url ?? "",
    solReserve:      Number(row.sol_reserve),
    tokenReserve:    Number(row.token_reserve),
    totalLiquidity:  Number(row.total_liquidity_usd),
    volume24h:       Number(row.volume_24h_usd),
    feePct:          Number(row.fee_pct),
    price:           Number(row.price_sol),
    priceChange24h:  Number(row.price_change_24h),
    createdAt:       new Date(row.created_at),
  };
}

/**
 * Fetch all active liquidity pools, ordered by total liquidity.
 */
export async function getPools(): Promise<LiquidityPool[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("pools")
    .select("*, tokens(symbol, name, image_url)")
    .eq("is_active", true)
    .order("total_liquidity_usd", { ascending: false });

  if (error) throw new Error(`getPools: ${error.message}`);

  return (data ?? []).map((row) =>
    rowToPool(row as PoolRow & { tokens: TokenRow | null })
  );
}

/**
 * Fetch a single pool by token mint address.
 */
export async function getPoolByMint(mintAddress: string): Promise<LiquidityPool | null> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("pools")
    .select("*, tokens(symbol, name, image_url)")
    .eq("mint_address", mintAddress)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`getPoolByMint: ${error.message}`);
  }

  return rowToPool(data as PoolRow & { tokens: TokenRow | null });
}

/**
 * Create or update a pool after a token is launched.
 */
export async function upsertPool(input: {
  mintAddress:    string;
  solReserve:     number;
  tokenReserve:   number;
  feePct?:        number;
  raydiumPoolId?: string | null;
}): Promise<void> {
  const db = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (db.from("pools") as any).upsert(
    {
      mint_address:     input.mintAddress,
      raydium_pool_id:  input.raydiumPoolId ?? null,
      sol_reserve:      input.solReserve,
      token_reserve:    input.tokenReserve,
      fee_pct:          input.feePct ?? 0.01,
    },
    { onConflict: "mint_address" }
  );

  if (error) throw new Error(`upsertPool: ${error.message}`);
}
