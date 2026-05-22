"use client";

import React from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { TokenCard, TokenCardSkeleton } from "@/components/token/TokenCard";
import { useTokens } from "@/hooks/useTokens";

export function TrendingSection() {
  const { tokens, loading, error } = useTokens({ sort: "trending", limit: 6 });

  return (
    <section className="px-4 pb-12">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[var(--gold)]" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Trending Tokens</h2>
          </div>
          <Link
            href="/trending"
            className="flex items-center gap-1 text-sm text-[var(--gold)] hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid */}
        {error ? (
          <div className="rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 p-6 text-center text-sm text-[#ef4444]">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <TokenCardSkeleton key={i} />)
              : tokens.map((token) => <TokenCard key={token.mintAddress} token={token} />)}
          </div>
        )}
      </div>
    </section>
  );
}
