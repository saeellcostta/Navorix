/**
 * GET  /api/tokens  — List tokens (paginated, sorted)
 * POST /api/tokens  — Register a newly created token after on-chain confirmation
 */

import { NextRequest, NextResponse } from "next/server";
import { getTokens, insertToken, type SortOption } from "@/services/db/tokenDbService";
import { upsertPool } from "@/services/db/poolDbService";
import { isValidPublicKey } from "@/utils/validation";
import { TOKEN_CREATION_FEE_SOL, solToTokensAtLaunch } from "@/config/solana";

// ── GET ──────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort   = (searchParams.get("sort")   ?? "trending") as SortOption;
  const limit  = Math.min(parseInt(searchParams.get("limit")  ?? "20"), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0"),   0);

  try {
    const tokens = await getTokens({ sort, limit, offset });
    return NextResponse.json(tokens, {
      headers: { "Cache-Control": "s-maxage=10, stale-while-revalidate=30" },
    });
  } catch (err) {
    console.error("[GET /api/tokens]", err);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}

// ── POST ─────────────────────────────────────────────────────
/**
 * Called by the frontend AFTER on-chain token creation is confirmed.
 *
 * Body: {
 *   mintAddress:    string   — Solana mint public key
 *   name:           string
 *   symbol:         string
 *   description?:   string
 *   imageUrl?:      string   — IPFS / Arweave URL
 *   decimals:       number
 *   initialSupply:  number
 *   creatorWallet:  string   — Solana public key of creator
 *   creationTx:     string   — Transaction signature of mint tx
 *   initialBuySol:  number   — SOL spent in pre-buy (can be 0)
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      mintAddress,
      name,
      symbol,
      description,
      imageUrl,
      decimals = 6,
      initialSupply = 1_000_000_000,
      creatorWallet,
      creationTx,
      initialBuySol = 0,
    } = body;

    // Basic validation
    if (!isValidPublicKey(mintAddress)) {
      return NextResponse.json({ error: "Invalid mintAddress" }, { status: 400 });
    }
    if (!isValidPublicKey(creatorWallet)) {
      return NextResponse.json({ error: "Invalid creatorWallet" }, { status: 400 });
    }
    if (!name?.trim() || !symbol?.trim()) {
      return NextResponse.json({ error: "name and symbol are required" }, { status: 400 });
    }

    const initialBuyTokens = solToTokensAtLaunch(Number(initialBuySol));

    // Insert token record
    const token = await insertToken({
      mint_address:       mintAddress,
      name:               name.trim(),
      symbol:             symbol.trim().toUpperCase(),
      description:        description ?? null,
      image_url:          imageUrl ?? null,
      decimals:           Number(decimals),
      initial_supply:     Number(initialSupply),
      creator_wallet:     creatorWallet,
      creation_fee_sol:   TOKEN_CREATION_FEE_SOL,
      initial_buy_sol:    Number(initialBuySol),
      initial_buy_tokens: initialBuyTokens,
      creation_tx:        creationTx ?? null,
    });

    // Bootstrap the pool with the initial buy SOL as starting reserve
    await upsertPool({
      mintAddress,
      solReserve:   Number(initialBuySol),
      tokenReserve: Number(initialSupply) - initialBuyTokens,
    });

    return NextResponse.json(token, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tokens]", err);
    const message = err instanceof Error ? err.message : "Internal server error";

    // Duplicate mint — token already registered
    if (message.includes("duplicate") || message.includes("unique")) {
      return NextResponse.json({ error: "Token already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
