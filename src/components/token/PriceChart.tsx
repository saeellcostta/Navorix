"use client";

import React, { useState } from "react";
import { TrendingUp, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";

interface PriceChartProps {
  mintAddress: string;
  symbol: string;
}

type ChartSource = "dexscreener" | "birdeye";

const CHART_SOURCES: { value: ChartSource; label: string; icon: string }[] = [
  { value: "dexscreener", label: "DexScreener", icon: "📊" },
  { value: "birdeye",     label: "Birdeye",     icon: "🦅" },
];

export function PriceChart({ mintAddress, symbol }: PriceChartProps) {
  const [source, setSource] = useState<ChartSource>("dexscreener");

  const dexScreenerUrl = `https://dexscreener.com/solana/${mintAddress}?embed=1&theme=dark&trades=1&info=0`;
  const birdeyeUrl     = `https://birdeye.so/token/${mintAddress}?chain=solana&embed=1`;

  const embedUrl = source === "dexscreener" ? dexScreenerUrl : birdeyeUrl;
  const externalUrl = source === "dexscreener"
    ? `https://dexscreener.com/solana/${mintAddress}`
    : `https://birdeye.so/token/${mintAddress}?chain=solana`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--gold)]" />
          Gráfico de Preço — ${symbol}
        </CardTitle>

        <div className="flex items-center gap-2">
          {/* Seletor de fonte */}
          <div className="flex items-center gap-1 bg-[var(--surface-3)] rounded-lg p-0.5">
            {CHART_SOURCES.map(s => (
              <button key={s.value} onClick={() => setSource(s.value)}
                className={[
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer",
                  source === s.value
                    ? "bg-[var(--surface-1)] text-[var(--gold)] shadow"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                ].join(" ")}>
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Link externo */}
          <a href={externalUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardHeader>

      <CardBody className="p-0 overflow-hidden rounded-b-xl">
        <iframe
          key={embedUrl}
          src={embedUrl}
          width="100%"
          height="500"
          style={{ border: "none", display: "block" }}
          allow="clipboard-write"
          title={`${symbol} price chart`}
        />
      </CardBody>
    </Card>
  );
}
