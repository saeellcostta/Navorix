/**
 * Token REST API client (browser-side).
 * Calls the Next.js API routes in /api/...
 */

import type { Token, TokenListItem } from "@/types/token";

const BASE = "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ── READ ───────────────────────────────────────────────

export async function fetchTokens(params?: {
  sort?: "trending" | "new" | "marketcap" | "volume";
  limit?: number;
  offset?: number;
}): Promise<TokenListItem[]> {
  const qs = new URLSearchParams(
    Object.entries(params ?? {}).reduce<Record<string, string>>(
      (acc, [k, v]) => { if (v !== undefined) acc[k] = String(v); return acc; },
      {}
    )
  ).toString();
  return apiFetch<TokenListItem[]>(`/tokens${qs ? `?${qs}` : ""}`);
}

export async function fetchToken(mintAddress: string): Promise<Token> {
  return apiFetch<Token>(`/tokens/${mintAddress}`);
}

export async function fetchTrendingTokens(limit = 20): Promise<TokenListItem[]> {
  return fetchTokens({ sort: "trending", limit });
}

export async function fetchNewTokens(limit = 20): Promise<TokenListItem[]> {
  return fetchTokens({ sort: "new", limit });
}

// ── WRITE ──────────────────────────────────────────────

/**
 * Register a newly created token in the database.
 * Call this AFTER on-chain transaction is confirmed.
 */
export async function registerToken(input: {
  mintAddress:    string;
  name:           string;
  symbol:         string;
  description?:   string;
  imageUrl?:      string;
  bannerUrl?:     string;
  decimals:       number;
  initialSupply:  number;
  creatorWallet:  string;
  creationTx:     string;
  initialBuySol:  number;
  raydiumPoolId?: string;
  social?: { twitter?: string; telegram?: string; website?: string; discord?: string };
}): Promise<Token> {
  return apiFetch<Token>("/tokens", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * Record a confirmed on-chain trade.
 */
export async function recordTrade(input: {
  mintAddress:   string;
  traderWallet:  string;
  direction:     "buy" | "sell";
  amountIn:      number;
  amountOut:     number;
  feeSol:        number;
  priceSol:      number;
  txSignature:   string;
}): Promise<void> {
  await apiFetch<void>("/trades", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * Upsert user record when wallet connects.
 */
export async function upsertUserOnConnect(walletAddress: string): Promise<void> {
  await apiFetch<void>("/user", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });
}
