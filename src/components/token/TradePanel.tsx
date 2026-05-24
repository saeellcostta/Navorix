"use client";

import React, { useState } from "react";
import { ArrowUpDown, Info, Loader2, ExternalLink, AlertTriangle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { useSwap } from "@/hooks/useSwap";
import { formatPct, formatCompact } from "@/utils/format";
import { DEFAULT_SLIPPAGE_PCT } from "@/config/solana";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface TradePanelProps {
  mintAddress: string;
  tokenSymbol: string;
  poolId: string | null;
}

export function TradePanel({ mintAddress, tokenSymbol, poolId }: TradePanelProps) {
  const { connected } = useWallet();
  const { t } = useLanguage();

  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [amountIn, setAmountIn]   = useState("");
  const [slippage, setSlippage]   = useState(DEFAULT_SLIPPAGE_PCT * 100);
  const [lastSig, setLastSig]     = useState<string | null>(null);

  const parsedAmount = parseFloat(amountIn) || 0;
  const isBuy = direction === "buy";

  const { quote, quoteLoading, executing, error: swapError, execute } = useSwap({
    poolId, mintAddress, direction, amountIn: parsedAmount, slippagePct: slippage / 100,
  });

  const handleSwap = async () => {
    if (!connected) return;
    const sig = await execute();
    if (sig) { setLastSig(sig); setAmountIn(""); }
  };

  const noPool = !poolId;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden">
      <div className="grid grid-cols-2 border-b border-[var(--border)] bg-[var(--surface-2)]">
        {(["buy", "sell"] as const).map(d => (
          <button key={d} onClick={() => { setDirection(d); setAmountIn(""); }}
            className={cn(
              "py-3 text-sm font-bold transition-all duration-150 cursor-pointer border-b-2",
              direction === d && d === "buy"
                ? "text-[var(--positive)] border-[var(--positive)] bg-[rgba(34,197,94,0.04)]"
                : direction === d && d === "sell"
                  ? "text-[var(--negative)] border-[var(--negative)] bg-[rgba(239,68,68,0.04)]"
                  : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]"
            )}>
            {d === "buy" ? t.trade.buy : t.trade.sell}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {noPool && (
          <div className="flex items-start gap-2 rounded-lg border border-[var(--gold)]/30 bg-[var(--gold-dim)] p-3">
            <AlertTriangle className="h-4 w-4 text-[var(--gold)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--gold)]">{t.trade.noLiquidity}</p>
          </div>
        )}

        <Input
          label={isBuy ? t.trade.youPay : t.trade.youSell.replace("{symbol}", tokenSymbol)}
          type="number" placeholder="0.00" min="0"
          value={amountIn} onChange={e => setAmountIn(e.target.value)} disabled={noPool}
          rightAdornment={<span className="text-xs font-semibold text-[var(--gold)]">{isBuy ? "SOL" : tokenSymbol}</span>}
        />

        <div className="flex justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-3)] border border-[var(--border)]">
            <ArrowUpDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            {isBuy ? `${t.trade.youReceive} (${tokenSymbol})` : `${t.trade.youReceive} (SOL)`}
          </p>
          <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 min-h-[52px] flex items-center">
            {quoteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />
            ) : quote ? (
              <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums">
                {isBuy ? formatCompact(quote.amountOut) : quote.amountOut.toFixed(4)}
              </p>
            ) : (
              <p className="text-[var(--text-muted)] text-sm">—</p>
            )}
          </div>
        </div>

        {quote && (
          <div className="rounded-lg bg-[var(--surface-2)] p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">{t.trade.priceImpact}</span>
              <span className={quote.priceImpactPct > 5 ? "text-[var(--negative)] font-bold" : "text-[var(--text-secondary)]"}>
                {formatPct(-quote.priceImpactPct)}{quote.priceImpactPct > 5 && " ⚠"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">{t.trade.fee}</span>
              <span className="text-[var(--text-secondary)]">{quote.fee.toFixed(6)} {isBuy ? "SOL" : tokenSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">{t.trade.minReceived}</span>
              <span className="text-[var(--text-secondary)] tabular-nums">
                {isBuy ? formatCompact(quote.minAmountOut) : quote.minAmountOut.toFixed(4)}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Info className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
          <span className="text-xs text-[var(--text-muted)]">{t.trade.slippage}</span>
          {[0.5, 1, 2, 5].map(v => (
            <button key={v} onClick={() => setSlippage(v)}
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border transition-colors cursor-pointer",
                slippage === v
                  ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold-dim)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
              )}>
              {v}%
            </button>
          ))}
        </div>

        {swapError && (
          <p className="text-xs text-[var(--negative)] bg-[rgba(239,68,68,0.08)] rounded-lg px-3 py-2 break-words">{swapError}</p>
        )}

        {!connected ? (
          <ConnectWalletButton size="lg" className="w-full" />
        ) : (
          <Button variant={isBuy ? "buy" : "sell"} size="lg" className="w-full"
            onClick={handleSwap} loading={executing}
            disabled={noPool || parsedAmount <= 0 || quoteLoading}>
            {noPool
              ? t.trade.noLiquidity
              : executing
                ? isBuy ? t.trade.buying : t.trade.selling
                : isBuy
                  ? `${t.trade.buy} ${tokenSymbol}`
                  : `${t.trade.sell} ${tokenSymbol}`}
          </Button>
        )}

        {lastSig && (
          <a href={`https://solscan.io/tx/${lastSig}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs text-[var(--positive)] hover:underline">
            {t.trade.confirmed}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
