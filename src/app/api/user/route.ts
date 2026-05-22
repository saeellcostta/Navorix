/**
 * POST /api/user — Upsert user record when wallet connects
 * Body: { walletAddress: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { upsertUser } from "@/services/db/tokenDbService";
import { isValidPublicKey } from "@/utils/validation";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!isValidPublicKey(walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    await upsertUser(walletAddress);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/user]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
