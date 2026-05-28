"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Bar, BarChart,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatUsd } from "@/utils/format";

interface PricePoint {
  time: string;
  price: number;
  timestamp: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
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

type Range     = "1H" | "6H" | "24H" | "7D";
type ChartType = "area" | "line" | "candle";

const RANGES: Range[] = ["1H", "6H", "24H", "7D"];

const CHART_TYPES: { value: ChartType; label: string; icon: string }[] = [
  { value: "area",   label: "Área",   icon: "⛰️" },
  { value: "line",   label: "Linha",  icon: "📈" },
  { value: "candle", label: "Velas",  icon: "🕯️" },
];

function getAvatarUrl(address: string): string {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${address}&backgroundColor=transparent`;
}

// ── Custom Dot com avatar ────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload?.trade) return null;
  const trade: Trade = payload.trade;
  const isBuy = trade.direction === "buy";
  const size = 26;
  return (
    <g>
      <line x1={cx} y1={cy - size / 2 - 4} x2={cx} y2={cy}
        stroke={isBuy ? "#22c55e" : "#ef4444"} strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={cx} cy={cy - size / 2 - 4 - size / 2} r={size / 2 + 2}
        fill={isBuy ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}
        stroke={isBuy ? "#22c55e" : "#ef4444"} strokeWidth={1.5} />
      <image href={getAvatarUrl(trade.trader_wallet)}
        x={cx - size / 2} y={cy - size - 8} width={size} height={size}
        clipPath={`circle(${size / 2}px at ${size / 2}px ${size / 2}px)`} />
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={isBuy ? "#22c55e" : "#ef4444"}>
        {isBuy ? "▲" : "▼"}
      </text>
    </g>
  );
};

// ── Tooltip customizado ──────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isCandle = d.open !== undefined;
  return (
    <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-strong)", borderRadius: 10, padding: "10px 14px", fontSize: 12 }}>
      <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
      {isCandle ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ color: "#f9fafb", fontWeight: 700 }}>O: {formatUsd(d.open)}</p>
          <p style={{ color: "#22c55e" }}>H: {formatUsd(d.high)}</p>
          <p style={{ color: "#ef4444" }}>L: {formatUsd(d.low)}</p>
          <p style={{ color: "#f9fafb", fontWeight: 700 }}>C: {formatUsd(d.close)}</p>
        </div>
      ) : (
        <p style={{ color: "#f9fafb", fontWeight: 700 }}>{formatUsd(d.price)}</p>
      )}
      {d.trade && (
        <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={getAvatarUrl(d.trade.trader_wallet)} alt="trader"
              style={{ width: 22, height: 22, borderRadius: "50%" }} />
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

// ── Candlestick customizado ──────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CandlestickBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;
  const { open, close, high, low } = payload;
  const isBullish = close >= open;
  const color = isBullish ? "#22c55e" : "#ef4444";
  const bodyTop    = Math.min(open, close);
  const bodyHeight = Math.abs(close - open);
  const priceRange = high - low;
  if (priceRange === 0) return null;
  const scale = height / priceRange;
  const wickX  = x + width / 2;
  const highY  = y;
  const lowY   = y + height;
  const bodyY  = y + (high - Math.max(open, close)) * scale;
  const bodyH  = Math.max(bodyHeight * scale, 2);

  return (
    <g>
      <line x1={wickX} y1={highY} x2={wickX} y2={lowY}
        stroke={color} strokeWidth={1.5} />
      <rect x={x + width * 0.15} y={bodyY} width={width * 0.7} height={bodyH}
        fill={color} rx={1} />
    </g>
  );
};

export function PriceChart({ mintAddress, symbol }: PriceChartProps) {
  const [range, setRange]         = useState<Range>("24H");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [data, setData]           = useState<PricePoint[]>([]);
  const [trades, setTrades]       = useState<Trade[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tokens/${mintAddress}/trades?limit=20`)
      .then(r => r.ok ? r.json() : [])
      .then((t: Trade[]) => setTrades(t))
      .catch(() => setTrades([]));

    const points = generatePlaceholderData(range);
    setTimeout(() => { setData(points); setLoading(false); }, 400);
  }, [mintAddress, range]);

  const dataWithTrades = data.map((point) => {
    const trade = trades.find(t => {
      const tradeTime = new Date(t.created_at).getTime();
      return Math.abs(tradeTime - point.timestamp) < 30 * 60 * 1000;
    });
    return trade ? { ...point, trade } : point;
  });

  const isPositive = data.length >= 2 && data[data.length - 1].price >= data[0].price;
  const color = isPositive ? "#22c55e" : "#ef4444";

  const commonAxisProps = {
    tick: { fill: "#6b7280", fontSize: 10 },
    axisLine: false,
    tickLine: false,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--gold)]" />
          Gráfico de Preço — ${symbol}
        </CardTitle>

        {/* Controles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tipo de gráfico */}
          <div className="flex items-center gap-1 bg-[var(--surface-3)] rounded-lg p-0.5">
            {CHART_TYPES.map(ct => (
              <button key={ct.value} onClick={() => setChartType(ct.value)}
                className={[
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer",
                  chartType === ct.value
                    ? "bg-[var(--surface-1)] text-[var(--gold)] shadow"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                ].join(" ")}>
                <span>{ct.icon}</span>
                <span className="hidden sm:inline">{ct.label}</span>
              </button>
            ))}
          </div>

          {/* Range */}
          <div className="flex items-center gap-1">
            {RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={[
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                  range === r
                    ? "bg-[var(--gold-dim)] text-[var(--gold)] border border-[var(--gold)]/30"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                ].join(" ")}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-0 pb-4">
        {loading ? (
          <div className="px-5"><Skeleton className="h-56 w-full" /></div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            {chartType === "area" ? (
              <AreaChart data={dataWithTrades} margin={{ top: 40, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" {...commonAxisProps} />
                <YAxis {...commonAxisProps} tickFormatter={v => formatUsd(v, true)} width={72} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2}
                  fill="url(#priceGrad)" dot={<CustomDot />} activeDot={{ r: 4, fill: color }} />
              </AreaChart>
            ) : chartType === "line" ? (
              <LineChart data={dataWithTrades} margin={{ top: 40, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" {...commonAxisProps} />
                <YAxis {...commonAxisProps} tickFormatter={v => formatUsd(v, true)} width={72} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2}
                  dot={<CustomDot />} activeDot={{ r: 4, fill: color }} />
              </LineChart>
            ) : (
              /* Candlestick via BarChart */
              <BarChart data={dataWithTrades} margin={{ top: 40, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" {...commonAxisProps} />
                <YAxis {...commonAxisProps} tickFormatter={v => formatUsd(v, true)} width={72}
                  domain={["auto", "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="price" shape={<CandlestickBar />} isAnimationActive={false}>
                  {dataWithTrades.map((entry, i) => (
                    <Cell key={i} fill={(entry.close ?? entry.price) >= (entry.open ?? entry.price) ? "#22c55e" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        )}

        {!loading && data.length === 0 && (
          <p className="text-center text-sm text-[var(--text-muted)] py-8">
            Dados de preço ainda não disponíveis
          </p>
        )}

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
    const close = basePrice * (1 + noise + i * 0.005);
    const open  = close * (1 + (Math.random() - 0.5) * 0.04);
    const high  = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low   = Math.min(open, close) * (1 - Math.random() * 0.02);
    const timeLabel = range === "7D"
      ? t.toLocaleDateString("pt-BR", { weekday: "short" })
      : t.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return { time: timeLabel, price: Math.max(close, 0), timestamp: t.getTime(), open, high, low, close };
  });
}
