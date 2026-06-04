/**
 * PATCH /api/admin/tokens/[mint] — Atualiza status do token
 * DELETE /api/admin/tokens/[mint] — Deleta token
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_WALLET = "FvmN4BnLKR25QWXXoLof2RZFzwC8XU3QLcPr1aJg1UvQ";

function isAdmin(req: NextRequest): boolean {
  const wallet = req.headers.get("x-wallet-address");
  return wallet === ADMIN_WALLET;
}

interface Params {
  params: Promise<{ mint: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mint } = await params;
  const body = await req.json();
  const { status } = body;

  if (!["launching", "live", "graduated"].includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db
    .from("tokens")
    .update({ status })
    .eq("mint_address", mint);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mint } = await params;
  const db = createAdminClient();

  const { error } = await db
    .from("tokens")
    .delete()
    .eq("mint_address", mint);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
