/**
 * GET  /api/tokens  — List tokens (paginated, sorted)
 * POST /api/tokens  — Register a newly created token after on-chain confirmation
 */

import { NextRequest, NextResponse } from "next/server";
import { getTokens, insertToken, type SortOption } from "@/services/db/tokenDbService";
import { upsertPool } from "@/services/db/poolDbService";
import { isValidPublicKey } from "@/utils/validation";
import { TOKEN_CREATION_FEE_SOL, solToTokensAtLaunch } from "@/config/solana";

const GRADUATION_THRESHOLD_SOL = 0.3;

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
    return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      mintAddress,
      name,
      symbol,
      description,
      imageUrl,
      bannerUrl,
      decimals = 6,
      initialSupply = 1_000_000_000,
      creatorWallet,
      creationTx,
      initialBuySol = 0,
      raydiumPoolId,
      social = {},
    } = body;

    // Validações
    if (!isValidPublicKey(mintAddress)) {
      return NextResponse.json({ error: "Invalid mintAddress" }, { status: 400 });
    }
    if (!isValidPublicKey(creatorWallet)) {
      return NextResponse.json({ error: "Invalid creatorWallet" }, { status: 400 });
    }
    if (!name?.trim() || !symbol?.trim()) {
      return NextResponse.json({ error: "name and symbol are required" }, { status: 400 });
    }

    const buySol = Number(initialBuySol);

    // ── Determina Launch Mode ──────────────────────────────
    // >= 0.3 SOL → Instant Launch (pool Raydium criada imediatamente)
    // <  0.3 SOL → Bonding Mode (acumula SOL até graduação)
    const isInstant    = buySol >= GRADUATION_THRESHOLD_SOL;
    const launchMode   = isInstant ? "instant" : "bonding";
    const tokenStatus  = isInstant ? "live"    : "launching";

    const initialBuyTokens = solToTokensAtLaunch(buySol, Number(initialSupply));

    // Insere token com status e launch_mode corretos
    const token = await insertToken({
      mint_address:              mintAddress,
      name:                      name.trim(),
      symbol:                    symbol.trim().toUpperCase(),
      description:               description ?? null,
      image_url:                 imageUrl ?? null,
      banner_url:                bannerUrl ?? null,
      twitter_url:               social.twitter  || null,
      telegram_url:              social.telegram || null,
      website_url:               social.website  || null,
      discord_url:               social.discord  || null,
      decimals:                  Number(decimals),
      initial_supply:            Number(initialSupply),
      creator_wallet:            creatorWallet,
      creation_fee_sol:          TOKEN_CREATION_FEE_SOL,
      initial_buy_sol:           buySol,
      initial_buy_tokens:        initialBuyTokens,
      creation_tx:               creationTx ?? null,
      // ── Novos campos de Launch Mode ──
      status:                    tokenStatus,
      launch_mode:               launchMode,
      escrow_sol:                isInstant ? 0 : buySol,
      graduation_threshold_sol:  GRADUATION_THRESHOLD_SOL,
    } as any);

    // Cria pool apenas se Instant Launch (>= 0.3 SOL)
    if (isInstant) {
      await upsertPool({
        mintAddress,
        solReserve:    buySol,
        tokenReserve:  Number(initialSupply) - initialBuyTokens,
        raydiumPoolId: raydiumPoolId ?? null,
      });
    }

    return NextResponse.json(token, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tokens]", err);
    const message = err instanceof Error ? err.message : "Internal server error";

    if (message.includes("duplicate") || message.includes("unique")) {
      return NextResponse.json({ error: "Token already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
