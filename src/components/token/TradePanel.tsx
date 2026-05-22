"use client";

import React, { useState } from "react";
import { ArrowUpDown, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useTradeQuote } from "@/hooks/useTradeQuote";
import { formatPct } from "@/utils/format";
import { DEFAULT_SLIPPAGE_PCT } from "@/config/solana";
import type { BondingCurveState } from "@/types/pool";
import { cn } from "@/lib/utils";

interface TradePanelProps {
  mintAddress: string;
  tokenSymbol: string;
  pool: BondingCurveState | null;
}

export function TradePanel({ mintAddress, tokenSymbol, pool }: TradePanelProps) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE_PCT * 100);

  const parsedAmount = parseFloat(amountIn) || 0;
  const quote = useTradeQuote({
    pool,
    mintAddress,
    direction,
    amountIn: parsedAmount,
    slippagePct: slippage / 100,
  });

  const handleTrade = () => {
    if (!connected) {
      setVisible(true);
      return;
    }
    alert("Wire up executeTrade() in src/services/solana/tradeService.ts");
  };

  const isBuy = direction === "buy";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden">
      {/* Buy / Sell toggle */}
      <div className="grid grid-cols-2 border-b border-[var(--border)] bg-[var(--surface-2)]">
        {(["buy", "sell"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDirection(d)}
            className={cn(
              "py-3 text-sm font-bold transition-all duration-150",
              "border-b-2 cursor-pointer",
              direction === d && d === "buy"
                ? "text-[var(--positive)] border-[var(--positive)] bg-[rgba(34,197,94,0.04)]"
                : direction === d && d === "sell"
                  ? "text-[var(--negative)] border-[var(--negative)] bg-[rgba(239,68,68,0.04)]"
                  : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]"
            )}
          >
            {d === "buy" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {/* Amount in */}
        <Input
          label={isBuy ? "You pay (SOL)" : `You sell (${tokenSymbol})`}
          type="number"
          placeholder="0.00"
          min="0"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
          rightAdornment={
            <span className="text-xs font-semibold text-[var(--gold)]">
              {isBuy ? "SOL" : tokenSymbol}
            </span>
          }
        />

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-3)] border border-[var(--border)]">
            <ArrowUpDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </div>
        </div>

        {/* Amount out */}
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            {isBuy ? `You receive (${tokenSymbol})` : "You receive (SOL)"}
          </p>
          <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3">
            <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums">
              {quote ? quote.amountOut.toFixed(4) : "—"}
            </p>
          </div>
        </div>

        {/* Quote details */}
        {quote && (
          <div className="rounded-lg bg-[var(--surface-2)] p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Price impact</span>
              <span className={quote.priceImpactPct > 5 ? "text-[var(--negative)]" : "text-[var(--text-secondary)]"}>
                {formatPct(-quote.priceImpactPct)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Platform fee (1%)</span>
              <span className="text-[var(--text-secondary)]">
                {quote.fee.toFixed(4)} {isBuy ? "SOL" : tokenSymbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Min received</span>
              <span className="text-[var(--text-secondary)]">{quote.minAmountOut.toFixed(4)}</span>
            </div>
          </div>
        )}

        {/* Slippage */}
        <div className="flex items-center gap-2 flex-wrap">
          <Info className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <span className="text-xs text-[var(--text-muted)]">Slippage:</span>
          {[0.5, 1, 2].map((v) => (
            <button
              key={v}
              onClick={() => setSlippage(v)}
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border transition-colors cursor-pointer",
                slippage === v
                  ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold-dim)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
              )}
            >
              {v}%
            </button>
          ))}
        </div>

        {/* CTA */}
        <Button
          variant={isBuy ? "buy" : "sell"}
          size="lg"
          className="w-full"
          onClick={handleTrade}
          disabled={parsedAmount <= 0}
        >
          {!connected
            ? "Connect Wallet"
            : isBuy
              ? `Buy ${tokenSymbol}`
              : `Sell ${tokenSymbol}`}
        </Button>
      </div>
    </div>
  );
}
