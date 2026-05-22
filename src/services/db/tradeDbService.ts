/**
 * Trade database service — record and query on-chain trades.
 * Server-side only.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type { TradeTransaction } from "@/types/trade";
import type { Database } from "@/lib/supabase/types";

type TradeInsert = Database["public"]["Tables"]["trades"]["Insert"];
type TradeRow    = Database["public"]["Tables"]["trades"]["Row"];

function rowToTrade(row: TradeRow): TradeTransaction {
  return {
    signature:   row.tx_signature,
    mintAddress: row.mint_address,
    direction:   row.direction as "buy" | "sell",
    amountIn:    Number(row.amount_in),
    amountOut:   Number(row.amount_out),
    fee:         Number(row.fee_sol),
    timestamp:   new Date(row.created_at),
    status:      "confirmed",
  };
}

/**
 * Record a confirmed trade in the database.
 * Called after connection.confirmTransaction() succeeds.
 */
export async function recordTrade(input: TradeInsert): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("trades").insert(input);
  if (error && error.code !== "23505") {
    // 23505 = unique_violation (duplicate tx_signature) — safe to ignore
    throw new Error(`recordTrade: ${error.message}`);
  }
}

/**
 * Fetch trade history for a specific token.
 */
export async function getTradesByMint(
  mintAddress: string,
  limit = 50
): Promise<TradeTransaction[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("trades")
    .select("*")
    .eq("mint_address", mintAddress)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getTradesByMint: ${error.message}`);
  return (data ?? []).map(rowToTrade);
}

/**
 * Fetch trade history for a specific wallet.
 */
export async function getTradesByWallet(
  walletAddress: string,
  limit = 50
): Promise<TradeTransaction[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("trades")
    .select("*")
    .eq("trader_wallet", walletAddress)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getTradesByWallet: ${error.message}`);
  return (data ?? []).map(rowToTrade);
}
