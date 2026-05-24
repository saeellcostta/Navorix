"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, Sparkles } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PriceChange } from "@/components/ui/PriceChange";
import { formatUsd, formatCompact, shortenAddress } from "@/utils/format";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TokenListItem } from "@/types/token";

interface TokenCardProps { token: TokenListItem; }

export function TokenCard({ token }: TokenCardProps) {
  const { t } = useLanguage();
  const stats = token.stats;

  return (
    <Link href={`/token/${token.mintAddress}`}>
      <Card hoverable className="h-full">
        <CardBody className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-3)]">
                {token.imageUrl ? (
                  <Image src={token.imageUrl} alt={token.name} fill className="object-cover" sizes="48px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[var(--gold)]">
                    {token.symbol.charAt(0)}
                  </div>
                )}
              </div>
              {token.isTrending && (
                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#fbbf24]">
                  <Flame className="h-3 w-3 text-[#08080f]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">{token.name}</h3>
                {token.isNew && (
                  <Badge variant="new" dot>
                    <Sparkles className="h-2.5 w-2.5" />
                    {t.marketplace.new.replace("✨ ", "")}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                ${token.symbol} · {shortenAddress(token.mintAddress)}
              </p>
            </div>

            {stats && (
              <div className="shrink-0 text-right">
                <PriceChange value={stats.priceChange24h} size="sm" />
              </div>
            )}
          </div>

          {stats && (
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-[var(--surface-2)] p-2.5">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{t.tokenCard.marketCap}</p>
                <p className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">{formatUsd(stats.marketCap, true)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{t.tokenCard.liquidity}</p>
                <p className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">{formatUsd(stats.liquidity, true)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{t.tokenCard.volume24h}</p>
                <p className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">{formatUsd(stats.volume24h, true)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{t.tokenCard.holders}</p>
                <p className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">{formatCompact(stats.holders)}</p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}

export function TokenCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-5 space-y-3">
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-xl bg-[var(--surface-3)] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-[var(--surface-3)] animate-pulse" />
          <div className="h-3 w-1/3 rounded bg-[var(--surface-3)] animate-pulse" />
        </div>
      </div>
      <div className="h-20 rounded-lg bg-[var(--surface-3)] animate-pulse" />
    </div>
  );
}
