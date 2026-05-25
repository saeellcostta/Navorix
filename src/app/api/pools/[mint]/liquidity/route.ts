/**
 * POST /api/pools/[mint]/liquidity
 * Adiciona liquidez a um pool existente
 */

import { NextRequest, NextResponse } from "next/server";
import { upsertPool, getPoolByMint } from "@/services/db/poolDbService";
import { isValidPublicKey } from "@/utils/validation";

interface Params {
  params: Promise<{ mint: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  const { mint } = await params;

  if (!isValidPublicKey(mint)) {
    return NextResponse.json({ error: "Mint inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { walletAddress, solAmount, tokenAmount, slippagePct } = body;

    if (!isValidPublicKey(walletAddress)) {
      return NextResponse.json({ error: "Carteira inválida" }, { status: 400 });
    }
    if (!solAmount || solAmount <= 0) {
      return NextResponse.json({ error: "Valor de SOL inválido" }, { status: 400 });
    }

    const pool = await getPoolByMint(mint);
    if (!pool) {
      return NextResponse.json({ error: "Pool não encontrado" }, { status: 404 });
    }

    const newSolReserve   = pool.solReserve   + Number(solAmount);
    const newTokenReserve = pool.tokenReserve + Number(tokenAmount ?? 0);

    await upsertPool({
      mintAddress:   mint,
      solReserve:    newSolReserve,
      tokenReserve:  newTokenReserve,
      feePct:        pool.feePct,
      raydiumPoolId: pool.raydiumPoolId,
    });

    return NextResponse.json({
      success: true,
      pool: {
        mintAddress:  mint,
        solReserve:   newSolReserve,
        tokenReserve: newTokenReserve,
      },
    });
  } catch (err) {
    console.error("[POST /api/pools/[mint]/liquidity]", err);
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
