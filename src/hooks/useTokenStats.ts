"use client";

/**
 * useTokenStats — fetches real-time market data from DexScreener
 * Called when the user opens a token page.
 * Falls back to DB stats if DexScreener has no data yet.
 */

import { useState, useEffect } from "react";

export interface LiveTokenStats {
  priceUsd:       number;
  priceSol:       number;
  priceChange24h: number;
  marketCap:      number;
  volume24h:      number;
  liquidity:      number;
  txCount24h:     number;
  source:         "dexscreener" | "db" | "none";
}

interface DexScreenerPair {
  chainId:     string;
  priceNative: string;
  priceUsd?:   string;
  txns:        { h24: { buys: number; sells: number } };
  volume:      { h24: number };
  priceChange: { h24: number };
  liquidity?:  { usd: number };
  fdv?:        number;
  marketCap?:  number;
}

async function fetchDexScreener(mintAddress: string): Promise<DexScreenerPair | null> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.pairs || data.pairs.length === 0) return null;

    const solanaPairs = data.pairs.filter((p: DexScreenerPair) => p.chainId === "solana");
    if (solanaPairs.length === 0) return null;

    return solanaPairs.sort((a: DexScreenerPair, b: DexScreenerPair) =>
      (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
    )[0];
  } catch {
    return null;
  }
}

async function getSolPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );
    const json = await res.json();
    return json?.solana?.usd ?? 145;
  } catch {
    return 145;
  }
}

export function useTokenStats(
  mintAddress: string,
  dbStats?: {
    price?: number;
    priceChange24h?: number;
    marketCap?: number;
    volume24h?: number;
    liquidity?: number;
  } | null
): { stats: LiveTokenStats | null; loading: boolean; refresh: () => void } {
  const [stats, setStats]     = useState<LiveTokenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick]       = useState(0);

  const refresh = () => setTick(t => t + 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      const [pair, solPrice] = await Promise.all([
        fetchDexScreener(mintAddress),
        getSolPrice(),
      ]);

      if (cancelled) return;

      if (pair && pair.priceUsd) {
        const priceUsd = parseFloat(pair.priceUsd);
        setStats({
          priceUsd,
          priceSol:       priceUsd / solPrice,
          priceChange24h: pair.priceChange?.h24 ?? 0,
          marketCap:      pair.marketCap ?? pair.fdv ?? 0,
          volume24h:      pair.volume?.h24 ?? 0,
          liquidity:      pair.liquidity?.usd ?? 0,
          txCount24h:     (pair.txns?.h24?.buys ?? 0) + (pair.txns?.h24?.sells ?? 0),
          source:         "dexscreener",
        });
      } else if (dbStats?.price) {
        // Fallback to DB stats
        setStats({
          priceUsd:       dbStats.price,
          priceSol:       dbStats.price / solPrice,
          priceChange24h: dbStats.priceChange24h ?? 0,
          marketCap:      dbStats.marketCap ?? 0,
          volume24h:      dbStats.volume24h ?? 0,
          liquidity:      dbStats.liquidity ?? 0,
          txCount24h:     0,
          source:         "db",
        });
      } else {
        setStats(null);
      }

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [mintAddress, tick]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, refresh };
}
