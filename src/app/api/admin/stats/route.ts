/**
 * GET /api/admin/stats — Estatísticas gerais do Navorix
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_WALLET = "FvmN4BnLKR25QWXXoLof2RZFzwC8XU3QLcPr1aJg1UvQ";

export async function GET(req: NextRequest) {
  const wallet = req.headers.get("x-wallet-address");
  if (wallet !== ADMIN_WALLET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();

  const [tokensRes, tradesRes, usersRes] = await Promise.all([
    db.from("tokens").select("status"),
    db.from("trades").select("amount_in, direction"),
    db.from("users").select("id"),
  ]);

  const tokens   = tokensRes.data ?? [];
  const trades   = tradesRes.data ?? [];
  const users    = usersRes.data ?? [];

  const totalVolumeSol = trades
    .filter(t => t.direction === "buy")
    .reduce((sum, t) => sum + Number(t.amount_in), 0);

  return NextResponse.json({
    totalTokens:     tokens.length,
    liveTokens:      tokens.filter(t => t.status === "live").length,
    launchingTokens: tokens.filter(t => t.status === "launching").length,
    totalTrades:     trades.length,
    totalVolumeSol,
    totalUsers:      users.length,
  });
}
