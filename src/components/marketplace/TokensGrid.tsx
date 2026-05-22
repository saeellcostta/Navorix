"use client";

import React, { useState } from "react";
import { TokenCard, TokenCardSkeleton } from "@/components/token/TokenCard";
import { TokensFilter } from "./TokensFilter";
import { useTokens } from "@/hooks/useTokens";
import { Button } from "@/components/ui/Button";
import type { TokenListItem } from "@/types/token";

type SortOption = "trending" | "new" | "marketcap" | "volume";

export function TokensGrid() {
  const [sort, setSort] = useState<SortOption>("trending");
  const [search, setSearch] = useState("");
  const { tokens, loading, error, refresh } = useTokens({ sort, limit: 50 });

  const filtered: TokenListItem[] = search.trim()
    ? tokens.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.symbol.toLowerCase().includes(search.toLowerCase()) ||
          t.mintAddress.toLowerCase().includes(search.toLowerCase())
      )
    : tokens;

  return (
    <div className="flex flex-col gap-6">
      <TokensFilter
        sort={sort}
        onSortChange={setSort}
        search={search}
        onSearchChange={setSearch}
      />

      {error && (
        <div className="rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 p-6 text-center space-y-3">
          <p className="text-sm text-[#ef4444]">{error}</p>
          <Button variant="outline" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <TokenCardSkeleton key={i} />)
          : filtered.map((token) => <TokenCard key={token.mintAddress} token={token} />)}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <div className="py-16 text-center text-[var(--text-muted)] text-sm">
          {search ? `No tokens matching "${search}"` : "No tokens found."}
        </div>
      )}
    </div>
  );
}
