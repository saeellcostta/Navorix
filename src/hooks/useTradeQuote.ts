"use client";

import { useState, useEffect } from "react";
import { calculateTradeQuote } from "@/services/solana/tradeService";
import type { TradeDirection, TradeQuote } from "@/types/trade";
import type { BondingCurveState } from "@/types/pool";

interface UseTradeQuoteOptions {
  pool: BondingCurveState | null;
  mintAddress: string;
  direction: TradeDirection;
  amountIn: number;
  slippagePct?: number;
}

export function useTradeQuote({
  pool,
  mintAddress,
  direction,
  amountIn,
  slippagePct = 0.01,
}: UseTradeQuoteOptions) {
  const [quote, setQuote] = useState<TradeQuote | null>(null);

  useEffect(() => {
    if (!pool || amountIn <= 0) {
      setQuote(null);
      return;
    }
    try {
      const q = calculateTradeQuote(pool, {
        mintAddress,
        direction,
        amountIn,
        slippagePct,
      });
      setQuote(q);
    } catch {
      setQuote(null);
    }
  }, [pool, mintAddress, direction, amountIn, slippagePct]);

  return quote;
}
