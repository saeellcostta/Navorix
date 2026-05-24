/**
 * GET /api/tokens/[mint]/trades
 * Returns recent trades for a given token mint address.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidPublicKey } from "@/utils/validation";

interface PageProps {
  params: Promise<{ mint: string }>;
}

export async function GET(req: NextRequest, { params }: PageProps) {
  const { mint } = await params;

  if (!isValidPublicKey(mint)) {
    return NextResponse.json({ error: "Invalid mint address" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const limit  = Math.min(parseInt(searchParams.get("limit")  ?? "20"), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0"),    0);

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("trades")
      .select("id, trader_wallet, direction, amount_in, amount_out, fee_sol, price_sol, created_at")
      .eq("mint_address", mint)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return NextResponse.json(data ?? [], {
      headers: { "Cache-Control": "s-maxage=5, stale-while-revalidate=10" },
    });
  } catch (err) {
    console.error("[GET /api/tokens/[mint]/trades]", err);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}
