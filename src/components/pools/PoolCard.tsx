"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Droplets, TrendingUp } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PriceChange } from "@/components/ui/PriceChange";
import { buttonVariants } from "@/components/ui/button-variants";
import { formatUsd, shortenAddress } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { LiquidityPool } from "@/types/pool";

interface PoolCardProps {
  pool: LiquidityPool;
}

export function PoolCard({ pool }: PoolCardProps) {
  return (
    <Card hoverable className="h-full">
      <CardBody className="flex flex-col gap-4">
        {/* Pool header */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-3)]">
            {pool.tokenImageUrl ? (
              <Image
                src={pool.tokenImageUrl}
                alt={pool.tokenName}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[var(--gold)]">
                {pool.tokenSymbol.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              SOL / {pool.tokenSymbol}
            </p>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {shortenAddress(pool.tokenMint)}
            </p>
          </div>
          <div className="ml-auto">
            <Badge variant="gold">{pool.feePct * 100}% fee</Badge>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-[var(--surface-2)] p-3">
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Liquidity
            </p>
            <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
              {formatUsd(pool.totalLiquidity, true)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Volume 24h
            </p>
            <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
              {formatUsd(pool.volume24h, true)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              SOL Reserve
            </p>
            <p className="text-sm font-semibold text-[var(--text-secondary)] tabular-nums">
              {pool.solReserve.toFixed(2)} SOL
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Price 24h
            </p>
            <PriceChange value={pool.priceChange24h} size="sm" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/pools/${pool.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
          >
            <Droplets className="h-3.5 w-3.5" />
            Add LP
          </Link>
          <Link
            href={`/token/${pool.tokenMint}`}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex-1")}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Trade
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

export function PoolCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-5 space-y-4">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-xl bg-[var(--surface-3)] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-[var(--surface-3)] animate-pulse" />
          <div className="h-3 w-1/4 rounded bg-[var(--surface-3)] animate-pulse" />
        </div>
      </div>
      <div className="h-24 rounded-lg bg-[var(--surface-3)] animate-pulse" />
      <div className="flex gap-2">
        <div className="h-8 flex-1 rounded-lg bg-[var(--surface-3)] animate-pulse" />
        <div className="h-8 flex-1 rounded-lg bg-[var(--surface-3)] animate-pulse" />
      </div>
    </div>
  );
}
