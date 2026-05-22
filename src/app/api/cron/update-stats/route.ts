/**
 * GET /api/cron/update-stats
 *
 * Vercel Cron Job — runs every 5 minutes (configured in vercel.json).
 * Updates token_stats table from on-chain pool reserves.
 *
 * Security:
 *   - Vercel sends CRON_SECRET in the Authorization header
 *   - Requests without the secret are rejected with 401
 *
 * Manual trigger (development):
 *   curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron/update-stats
 */

import { NextRequest, NextResponse } from "next/server";
import { runPriceIndexer } from "@/services/solana/priceIndexer";

export const dynamic    = "force-dynamic";
export const maxDuration = 30; // seconds (Vercel Pro allows up to 300)

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = Date.now();

  try {
    const result = await runPriceIndexer();

    return NextResponse.json({
      ok:        true,
      updated:   result.updated,
      errors:    result.errors,
      durationMs: Date.now() - start,
      timestamp:  new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/update-stats]", err);
    return NextResponse.json(
      {
        ok:        false,
        error:     err instanceof Error ? err.message : "Internal error",
        durationMs: Date.now() - start,
        timestamp:  new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
