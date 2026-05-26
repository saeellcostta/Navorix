"use client";

import { BarChart3, Droplets, TrendingUp, Users, RefreshCw } from "lucide-react";
import { useTokenStats } from "@/hooks/useTokenStats";
import { formatUsd, formatCompact } from "@/utils/format";
import { PriceChange } from "@/components/ui/PriceChange";

interface Props {
  mintAddress: string;
  symbol: string;
  dbStats?: {
    price?: number;
    priceChange24h?: number;
    marketCap?: number;
    volume24h?: number;
    liquidity?: number;
    holders?: number;
  } | null;
}

export function TokenStatsPanel({ mintAddress, symbol, dbStats }: Props) {
  const { stats, loading, refresh } = useTokenStats(mintAddress, dbStats);

  const price         = stats?.priceUsd ?? dbStats?.price ?? 0;
  const priceChange   = stats?.priceChange24h ?? dbStats?.priceChange24h ?? 0;
  const marketCap     = stats?.marketCap ?? dbStats?.marketCap ?? 0;
  const liquidity     = stats?.liquidity ?? dbStats?.liquidity ?? 0;
  const volume24h     = stats?.volume24h ?? dbStats?.volume24h ?? 0;
  const holders       = dbStats?.holders ?? 0;
  const isDex         = stats?.source === "dexscreener";

  return (
    <div className="space-y-3">
      {/* Preço principal */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">
          {loading ? (
            <span className="inline-block h-7 w-24 rounded bg-[var(--surface-3)] animate-pulse" />
          ) : (
            formatUsd(price)
          )}
        </span>
        {!loading && <PriceChange value={priceChange} size="md" />}
        <button
          onClick={refresh}
          className="ml-auto flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors cursor-pointer"
          title="Atualizar dados"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          {isDex ? (
            <span className="text-[var(--positive)]">ao vivo</span>
          ) : (
            <span>atualizar</span>
          )}
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Market Cap",  value: loading ? null : formatUsd(marketCap, true),  icon: <BarChart3 className="h-4 w-4" /> },
          { label: "Liquidez",    value: loading ? null : formatUsd(liquidity, true),  icon: <Droplets className="h-4 w-4" /> },
          { label: "Volume 24h",  value: loading ? null : formatUsd(volume24h, true),  icon: <TrendingUp className="h-4 w-4" /> },
          { label: "Holders",     value: loading ? null : formatCompact(holders),      icon: <Users className="h-4 w-4" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-3">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1">
              {icon}
              <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </div>
            {value === null ? (
              <div className="h-5 w-16 rounded bg-[var(--surface-3)] animate-pulse" />
            ) : (
              <p className="text-base font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Fonte dos dados */}
      {!loading && (
        <p className="text-[10px] text-[var(--text-muted)] text-right">
          {isDex ? "📡 Dados em tempo real via DexScreener" : "🗄️ Dados do banco · atualiza ao abrir"}
        </p>
      )}
    </div>
  );
}
