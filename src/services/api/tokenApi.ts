/**
 * Token REST API client
 *
 * These functions call the Next.js API routes (/api/...) which in turn
 * read from Supabase / index on-chain data. Swap out the fetch calls
 * if you add a dedicated backend (Railway / Render).
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
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTokens(params?: {
  sort?: "trending" | "new" | "marketcap" | "volume";
  limit?: number;
  offset?: number;
}): Promise<TokenListItem[]> {
  const qs = new URLSearchParams(
    Object.entries(params ?? {}).reduce<Record<string, string>>(
      (acc, [k, v]) => {
        if (v !== undefined) acc[k] = String(v);
        return acc;
      },
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
