/**
 * POST /api/bonding/[mint]/buy
 * Registra uma compra antecipada na fase bonding
 * Quando escrow_sol >= graduation_threshold, gradua automaticamente
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidPublicKey } from "@/utils/validation";

interface Params {
  params: Promise<{ mint: string }>;
}

const GRADUATION_THRESHOLD_SOL = 0.3;

export async function POST(req: NextRequest, { params }: Params) {
  const { mint } = await params;

  if (!isValidPublicKey(mint)) {
    return NextResponse.json({ error: "Mint inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { buyerWallet, solAmount, tokenAmount } = body;

    if (!isValidPublicKey(buyerWallet)) {
      return NextResponse.json({ error: "Carteira inválida" }, { status: 400 });
    }
    if (!solAmount || solAmount <= 0) {
      return NextResponse.json({ error: "Valor de SOL inválido" }, { status: 400 });
    }

    const db = createAdminClient();

    // Busca token
    const { data: token, error: tokenError } = await db
      .from("tokens")
      .select("mint_address, status, escrow_sol, graduation_threshold_sol, name, symbol")
      .eq("mint_address", mint)
      .single();

    if (tokenError || !token) {
      return NextResponse.json({ error: "Token não encontrado" }, { status: 404 });
    }

    if (token.status !== "launching") {
      return NextResponse.json({ error: "Token não está em fase de lançamento" }, { status: 400 });
    }

    // Gera tx signature simulada (em produção viria da transação real)
    const txSignature = `bonding_${mint.slice(0, 8)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Registra compra
    const { error: purchaseError } = await db
      .from("bonding_purchases")
      .insert({
        mint_address:  mint,
        buyer_wallet:  buyerWallet,
        sol_amount:    Number(solAmount),
        token_amount:  Number(tokenAmount),
        price_sol:     Number(solAmount) / Number(tokenAmount),
        tx_signature:  txSignature,
      });

    if (purchaseError) {
      throw new Error(`Erro ao registrar compra: ${purchaseError.message}`);
    }

    // Atualiza escrow_sol
    const newEscrowSol = Number(token.escrow_sol) + Number(solAmount);
    const threshold    = Number(token.graduation_threshold_sol) || GRADUATION_THRESHOLD_SOL;
    const shouldGraduate = newEscrowSol >= threshold;

    const { error: updateError } = await db
      .from("tokens")
      .update({
        escrow_sol: newEscrowSol,
        ...(shouldGraduate ? { status: "live", is_graduated: true } : {}),
      })
      .eq("mint_address", mint);

    if (updateError) {
      throw new Error(`Erro ao atualizar escrow: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      purchase: {
        solAmount:    Number(solAmount),
        tokenAmount:  Number(tokenAmount),
        txSignature,
        newEscrowSol,
        graduated:    shouldGraduate,
      },
    });

  } catch (err) {
    console.error("[POST /api/bonding/[mint]/buy]", err);
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
