"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatUsd } from "@/utils/format";

interface PricePoint {
  time: string;
  price: number;
  timestamp: number;
}

interface Trade {
  id: string;
  trader_wallet: string;
  direction: "buy" | "sell";
  price_sol: number;
  amount_in: number;
  created_at: string;
}

interface PriceChartProps {
  mintAddress: string;
  symbol: string;
}

type Range = "1H" | "6H" | "24H" | "7D";

const RANGES: Range[] = ["1H", "6H", "24H", "7D"];

function getAvatarUrl(address: string): string {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${address}&backgroundColor=transparent`;
}

// Custom dot que mostra avatar nos trades
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload?.trade) return null;

  const trade: Trade = payload.trade;
  const isBuy = trade.direction === "buy";
  const size = 28;
  const avatarUrl = getAvatarUrl(trade.trader_wallet);

  return (
    <g>
      {/* Linha vertical */}
      <line
        x1={cx} y1={cy - size / 2 - 4}
        x2={cx} y2={cy}
        stroke={isBuy ? "#22c55e" : "#ef4444"}
        strokeWidth={1.5}
        strokeDasharray="3 2"
      />
      {/* Círculo fundo */}
      <circle
        cx={cx} cy={cy - size / 2 - 4 - size / 2}
        r={size / 2 + 2}
        fill={isBuy ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}
        stroke={isBuy ? "#22c55e" : "#ef4444"}
        strokeWidth={1.5}
      />
      {/* Avatar */}
      <image
        href={avatarUrl}
        x={cx - size / 2}
        y={cy - size - 8}
        width={size}
        height={size}
        clipPath={`circle(${size / 2}px at ${size / 2}px ${size / 2}px)`}
        style={{ borderRadius: "50%" }}
      />
      {/* Seta buy/sell */}
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={isBuy ? "#22c55e" : "#ef4444"}
      >
        {isBuy ? "▲" : "▼"}
      </text>
    </g>
  );
};

// Tooltip customizado
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div style={{
      background: "var(--surface-2)",
      border: "1px solid var(--border-strong)",
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
    }}>
      <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#f9fafb", fontWeight: 700 }}>{formatUsd(d.price)}</p>
      {d.trade && (
        <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={getAvatarUrl(d.trade.trader_wallet)}
              alt="trader"
              style={{ width: 24, height: 24, borderRadius: "50%" }}
            />
            <div>
              <p style={{ color: d.trade.direction === "buy" ? "#22c55e" : "#ef4444", fontWeight: 700 }}>
                {d.trade.direction === "buy" ? "▲ Compra" : "▼ Venda"}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: 10 }}>
                {d.trade.trader_wallet.slice(0, 6)}...{d.trade.trader_wallet.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function PriceChart({ mintAddress, symbol }: PriceChartProps) {
  const [range, setRange]     = useState<Range>("24H");
  const [data, setData]       = useState<PricePoint[]>([]);
  const [trades, setTrades]   = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetch trades do banco
    fetch(`/api/tokens/${mintAddress}/trades?limit=20`)
      .then(r => r.ok ? r.json() : [])
      .then((t: Trade[]) => setTrades(t))
      .catch(() => setTrades([]));

    const points = generatePlaceholderData(range);
    setTimeout(() => {
      setData(points);
      setLoading(false);
    }, 400);
  }, [mintAddress, range]);

  // Mapeia trades para pontos do gráfico mais próximos
  const dataWithTrades = data.map((point, i) => {
    const trade = trades.find(t => {
      const tradeTime = new Date(t.created_at).getTime();
      return Math.abs(tradeTime - point.timestamp) < 30 * 60 * 1000; // dentro de 30min
    });
    return trade ? { ...point, trade } : point;
  });

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
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dataWithTrades} margin={{ top: 40, right: 16, left: 0, bottom: 0 }}>
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
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={<CustomDot />}
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

        {/* Legenda */}
        {trades.length > 0 && (
          <div className="flex items-center gap-4 px-5 pt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[#22c55e] text-xs font-bold">▲</span>
              <span className="text-xs text-[var(--text-muted)]">Compra</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#ef4444] text-xs font-bold">▼</span>
              <span className="text-xs text-[var(--text-muted)]">Venda</span>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

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
    return { time: timeLabel, price: Math.max(price, 0), timestamp: t.getTime() };
  });
}
