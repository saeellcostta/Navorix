/**
 * GET  /api/admin/tokens — Lista todos os tokens
 * PATCH /api/admin/tokens/[mint] — Atualiza status
 * DELETE /api/admin/tokens/[mint] — Deleta token
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_WALLET = "FvmN4BnLKR25QWXXoLof2RZFzwC8XU3QLcPr1aJg1UvQ";

function isAdmin(req: NextRequest): boolean {
  const wallet = req.headers.get("x-wallet-address");
  return wallet === ADMIN_WALLET;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("tokens")
    .select("mint_address, name, symbol, status, creator_wallet, created_at, escrow_sol, image_url")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
