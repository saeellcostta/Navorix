/**
 * GET /api/pools — List all active liquidity pools
 */

import { NextResponse } from "next/server";
import { getPools } from "@/services/db/poolDbService";

export async function GET() {
  try {
    const pools = await getPools();
    return NextResponse.json(pools, {
      headers: { "Cache-Control": "s-maxage=15, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("[GET /api/pools]", err);
    return NextResponse.json({ error: "Failed to fetch pools" }, { status: 500 });
  }
}
