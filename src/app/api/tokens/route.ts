/**
 * GET /api/tokens
 *
 * Returns a list of tokens from the database.
 * Replace the stub response with a real Supabase / Prisma query.
 *
 * Query params:
 *   sort    = "trending" | "new" | "marketcap" | "volume"  (default: "trending")
 *   limit   = number  (default: 20, max: 100)
 *   offset  = number  (default: 0)
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort   = searchParams.get("sort")   ?? "trending";
  const limit  = Math.min(parseInt(searchParams.get("limit")  ?? "20"),  100);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  // TODO: Replace with actual Supabase / Prisma query
  // Example:
  // const { data, error } = await supabase
  //   .from("tokens")
  //   .select("*, token_stats(*)")
  //   .order(sortColumn, { ascending: false })
  //   .range(offset, offset + limit - 1);

  // Return empty array until DB is wired up
  return NextResponse.json([], {
    headers: { "Cache-Control": "s-maxage=10, stale-while-revalidate=30" },
  });
}
