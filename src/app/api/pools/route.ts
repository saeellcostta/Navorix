/**
 * GET /api/pools
 *
 * Returns all active liquidity pools.
 * Replace stub with a real DB query.
 */

import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Fetch from Supabase / Prisma
  return NextResponse.json([], {
    headers: { "Cache-Control": "s-maxage=15, stale-while-revalidate=60" },
  });
}
