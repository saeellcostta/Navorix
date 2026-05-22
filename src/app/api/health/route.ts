/**
 * GET /api/health — Health check endpoint
 *
 * Verifica: DB Supabase + variáveis de ambiente críticas.
 * Usado por Vercel, UptimeRobot, ou qualquer monitor de disponibilidade.
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, boolean | string> = {};
  let healthy = true;

  // 1. Env vars
  checks.supabase_url    = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  checks.supabase_key    = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  checks.solana_network  = process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "devnet";

  // 2. Database ping
  try {
    const db = createAdminClient();
    const { count, error } = await db
      .from("tokens")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    checks.database = `ok (${count ?? 0} tokens)`;
  } catch (err) {
    checks.database = `error: ${err instanceof Error ? err.message : "unknown"}`;
    healthy = false;
  }

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
