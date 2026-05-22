"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { shortenAddress, timeAgo } from "@/utils/format";
import type { TradeTransaction } from "@/types/trade";

interface TradeHistoryProps {
  mintAddress: string;
}

export function TradeHistory({ mintAddress }: TradeHistoryProps) {
  const [trades, setTrades]   = useState<TradeTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/trades?mint=${mintAddress}&limit=20`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTrades(data);
      } catch {
        setTrades([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [mintAddress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[var(--gold)]" />
          Histórico de Trades
        </CardTitle>
      </CardHeader>
      <CardBody className="p-0">
        {/* Table header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-5 py-2.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface-2)] border-b border-[var(--border)]">
          <span>Tipo</span>
          <span>Carteira</span>
          <span className="text-right">SOL</span>
          <span className="text-right">Tempo</span>
        </div>

        {loading ? (
          <div className="p-5 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : trades.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-muted)] py-10">
            Nenhum trade ainda
          </p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {trades.map((trade) => (
              <div
                key={trade.signature}
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-5 py-3 hover:bg-[var(--surface-2)] transition-colors"
              >
                {/* Direction */}
                <div className={[
                  "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold",
                  trade.direction === "buy"
                    ? "bg-[rgba(34,197,94,0.12)] text-[var(--positive)]"
                    : "bg-[rgba(239,68,68,0.12)] text-[var(--negative)]",
                ].join(" ")}>
                  {trade.direction === "buy"
                    ? <ArrowUpRight className="h-3.5 w-3.5" />
                    : <ArrowDownLeft className="h-3.5 w-3.5" />}
                </div>

                {/* Wallet */}
                <a
                  href={`https://solscan.io/account/${trade.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
                >
                  {shortenAddress(trade.signature, 4)}
                </a>

                {/* Amount */}
                <span className={[
                  "text-sm font-semibold tabular-nums text-right",
                  trade.direction === "buy" ? "text-[var(--positive)]" : "text-[var(--negative)]",
                ].join(" ")}>
                  {trade.direction === "buy" ? "+" : "-"}
                  {trade.amountIn.toFixed(3)} SOL
                </span>

                {/* Time */}
                <span className="text-xs text-[var(--text-muted)] text-right whitespace-nowrap">
                  {timeAgo(new Date(trade.timestamp))}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
