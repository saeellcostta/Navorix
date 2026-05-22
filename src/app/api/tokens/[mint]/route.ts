/**
 * GET /api/tokens/[mint] — Fetch full token detail by mint address
 */

import { NextRequest, NextResponse } from "next/server";
import { getTokenByMint } from "@/services/db/tokenDbService";
import { isValidPublicKey } from "@/utils/validation";

interface RouteParams {
  params: Promise<{ mint: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { mint } = await params;

  if (!isValidPublicKey(mint)) {
    return NextResponse.json({ error: "Invalid mint address" }, { status: 400 });
  }

  try {
    const token = await getTokenByMint(mint);

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json(token, {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error(`[GET /api/tokens/${mint}]`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
