"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatUsd } from "@/utils/format";

interface PricePoint {
  time: string;
  price: number;
}

interface PriceChartProps {
  mintAddress: string;
  symbol: string;
}

type Range = "1H" | "6H" | "24H" | "7D";

const RANGES: Range[] = ["1H", "6H", "24H", "7D"];

export function PriceChart({ mintAddress, symbol }: PriceChartProps) {
  const [range, setRange]   = useState<Range>("24H");
  const [data, setData]     = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch from /api/tokens/[mint]/chart?range=...
    // For now generate placeholder data until indexer feeds price history
    const points = generatePlaceholderData(range);
    setTimeout(() => {
      setData(points);
      setLoading(false);
    }, 400);
  }, [mintAddress, range]);

  const isPositive = data.length >= 2 && data[data.length - 1].price >= data[0].price;
  const color = isPositive ? "#22c55e" : "#ef4444";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--gold)]" />
          Gráfico de Preço — ${symbol}
        </CardTitle>
        <div className="flex items-center gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={[
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                range === r
                  ? "bg-[var(--gold-dim)] text-[var(--gold)] border border-[var(--gold)]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardBody className="p-0 pb-4">
        {loading ? (
          <div className="px-5">
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="time"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatUsd(v, true)}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--text-muted)" }}
                formatter={(value) => [formatUsd(Number(value)), "Preço"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 4, fill: color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {!loading && data.length === 0 && (
          <p className="text-center text-sm text-[var(--text-muted)] py-8">
            Dados de preço ainda não disponíveis
          </p>
        )}
      </CardBody>
    </Card>
  );
}

/** Generates placeholder sinusoidal price data for UI until real indexer feeds data */
function generatePlaceholderData(range: Range): PricePoint[] {
  const counts: Record<Range, number> = { "1H": 12, "6H": 24, "24H": 48, "7D": 84 };
  const n = counts[range];
  const basePrice = 0.000024;
  const now = Date.now();
  const intervalMs: Record<Range, number> = {
    "1H":  5 * 60 * 1000,
    "6H":  15 * 60 * 1000,
    "24H": 30 * 60 * 1000,
    "7D":  2 * 60 * 60 * 1000,
  };
  const interval = intervalMs[range];

  return Array.from({ length: n }, (_, i) => {
    const t = new Date(now - (n - i) * interval);
    const noise = (Math.sin(i * 0.8) + Math.random() * 0.4 - 0.2) * 0.15;
    const price = basePrice * (1 + noise + i * 0.005);
    const timeLabel = range === "7D"
      ? t.toLocaleDateString("pt-BR", { weekday: "short" })
      : t.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return { time: timeLabel, price: Math.max(price, 0) };
  });
}
