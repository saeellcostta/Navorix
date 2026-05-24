"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import { useTokens } from "@/hooks/useTokens";
import { PriceChange } from "@/components/ui/PriceChange";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatUsd, formatCompact } from "@/utils/format";
import { useLanguage } from "@/contexts/LanguageContext";

export function TrendingClient() {
  const { tokens, loading, error } = useTokens({ sort: "trending", limit: 50 });
  const { t } = useLanguage();

  if (error) {
    return (
      <div className="rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 p-6 text-center text-sm text-[#ef4444]">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden">
      <div className="grid grid-cols-[auto_1fr_repeat(4,auto)] items-center gap-4 px-5 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] bg-[var(--surface-2)] hidden md:grid">
        <span>#</span>
        <span>{t.trending.token}</span>
        <span className="text-right">{t.trending.price}</span>
        <span className="text-right">{t.trending.change24}</span>
        <span className="text-right">{t.trending.marketCap}</span>
        <span className="text-right">{t.trending.volume24}</span>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="h-4 w-5 shrink-0" />
                <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            ))
          : tokens.map((token, idx) => (
              <Link
                key={token.mintAddress}
                href={`/token/${token.mintAddress}`}
                className="flex md:grid md:grid-cols-[auto_1fr_repeat(4,auto)] items-center gap-4 px-5 py-4 hover:bg-[var(--surface-2)] transition-colors"
              >
                <div className="flex items-center gap-1 w-6 shrink-0">
                  {idx < 3 ? (
                    <Flame className={`h-4 w-4 ${idx === 0 ? "text-[#fbbf24]" : idx === 1 ? "text-[#9ca3af]" : "text-[#92400e]"}`} />
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] font-mono">{idx + 1}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-3)] shrink-0">
                    {token.imageUrl ? (
                      <Image src={token.imageUrl} alt={token.name} width={36} height={36} className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[var(--gold)]">
                        {token.symbol.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{token.name}</span>
                      {token.isNew && <Badge variant="new" className="shrink-0">{t.marketplace.new.replace("✨ ", "")}</Badge>}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-mono">${token.symbol}</span>
                  </div>
                </div>

                <div className="hidden md:block text-right">
                  <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                    {token.stats ? formatUsd(token.stats.price) : "—"}
                  </span>
                </div>

                <div className="hidden md:flex justify-end">
                  {token.stats ? <PriceChange value={token.stats.priceChange24h} size="sm" /> : <span className="text-[var(--text-muted)] text-sm">—</span>}
                </div>

                <div className="hidden md:block text-right">
                  <span className="text-sm text-[var(--text-secondary)] tabular-nums">
                    {token.stats ? formatUsd(token.stats.marketCap, true) : "—"}
                  </span>
                </div>

                <div className="hidden md:block text-right">
                  <span className="text-sm text-[var(--text-secondary)] tabular-nums">
                    {token.stats ? formatCompact(token.stats.volume24h) : "—"}
                  </span>
                </div>

                <div className="md:hidden ml-auto">
                  {token.stats ? <PriceChange value={token.stats.priceChange24h} size="sm" /> : null}
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
