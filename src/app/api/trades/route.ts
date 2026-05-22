/**
 * POST /api/trades — Record a confirmed on-chain trade
 * GET  /api/trades?mint=...  — Trade history for a token
 * GET  /api/trades?wallet=...— Trade history for a wallet
 */

import { NextRequest, NextResponse } from "next/server";
import { recordTrade, getTradesByMint, getTradesByWallet } from "@/services/db/tradeDbService";
import { isValidPublicKey } from "@/utils/validation";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mint   = searchParams.get("mint");
  const wallet = searchParams.get("wallet");
  const limit  = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);

  if (!mint && !wallet) {
    return NextResponse.json({ error: "Provide ?mint= or ?wallet=" }, { status: 400 });
  }

  try {
    const trades = mint
      ? await getTradesByMint(mint, limit)
      : await getTradesByWallet(wallet!, limit);

    return NextResponse.json(trades);
  } catch (err) {
    console.error("[GET /api/trades]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mintAddress, traderWallet, direction,
      amountIn, amountOut, feeSol, priceSol, txSignature,
    } = body;

    if (!isValidPublicKey(mintAddress) || !isValidPublicKey(traderWallet)) {
      return NextResponse.json({ error: "Invalid wallet/mint address" }, { status: 400 });
    }
    if (!["buy", "sell"].includes(direction)) {
      return NextResponse.json({ error: "direction must be 'buy' or 'sell'" }, { status: 400 });
    }

    await recordTrade({
      mint_address:  mintAddress,
      trader_wallet: traderWallet,
      direction,
      amount_in:     Number(amountIn),
      amount_out:    Number(amountOut),
      fee_sol:       Number(feeSol ?? 0),
      price_sol:     Number(priceSol ?? 0),
      tx_signature:  txSignature,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/trades]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
