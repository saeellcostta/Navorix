"use client";

import React, { useState, useEffect } from "react";
import { PoolCard, PoolCardSkeleton } from "./PoolCard";
import type { LiquidityPool } from "@/types/pool";

export function PoolsListClient() {
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/pools");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPools(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pools");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 p-6 text-center text-sm text-[#ef4444]">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <PoolCardSkeleton key={i} />)
        : pools.length > 0
          ? pools.map((pool) => <PoolCard key={pool.id} pool={pool} />)
          : (
            <div className="col-span-full py-16 text-center text-[var(--text-muted)] text-sm">
              No pools yet. Create a token to automatically deploy a pool.
            </div>
          )}
    </div>
  );
}
