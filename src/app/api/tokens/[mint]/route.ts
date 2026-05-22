/**
 * GET /api/tokens/[mint]
 *
 * Returns detailed info for a single token by mint address.
 * Falls back to on-chain metadata if not in database.
 */

import { NextRequest, NextResponse } from "next/server";
import { isValidPublicKey } from "@/utils/validation";

interface RouteParams {
  params: Promise<{ mint: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { mint } = await params;

  if (!isValidPublicKey(mint)) {
    return NextResponse.json({ error: "Invalid mint address" }, { status: 400 });
  }

  // TODO: query DB then fallback to on-chain Metaplex metadata
  // const token = await getTokenFromDb(mint) ?? await fetchOnChainMetadata(mint);

  return NextResponse.json(
    { error: "Not found — wire up database in src/app/api/tokens/[mint]/route.ts" },
    { status: 404 }
  );
}
