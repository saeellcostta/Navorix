"use client";

/**
 * useSwap — Real buy/sell hook via Raydium CPMM
 *
 * Usage:
 *   const { quote, loading, execute } = useSwap({ poolId, direction, amountIn, slippagePct });
 *
 * quote  — calculated output amount, fee, price impact
 * execute — sends the actual on-chain swap transaction
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import { getSwapQuote, executeSwap, type SwapQuote } from "@/services/solana/raydiumService";
import { recordTrade } from "@/services/api/tokenApi";
import { DEFAULT_SLIPPAGE_PCT } from "@/config/solana";

interface UseSwapOptions {
  poolId:      string | null;
  mintAddress: string;
  direction:   "buy" | "sell";
  amountIn:    number;
  slippagePct?: number;
}

export function useSwap({
  poolId,
  mintAddress,
  direction,
  amountIn,
  slippagePct = DEFAULT_SLIPPAGE_PCT,
}: UseSwapOptions) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const [quote, setQuote]       = useState<SwapQuote | null>(null);
  const [quoteLoading, setQL]   = useState(false);
  const [executing, setExec]    = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch quote with 400ms debounce
  useEffect(() => {
    if (!poolId || amountIn <= 0) {
      setQuote(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setQL(true);
      setError(null);
      try {
        const q = await getSwapQuote(connection, {
          poolId,
          direction,
          amountIn,
          slippagePct,
        });
        setQuote(q);
      } catch (err) {
        setQuote(null);
        setError(err instanceof Error ? err.message : "Erro ao calcular quote");
      } finally {
        setQL(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [connection, poolId, direction, amountIn, slippagePct]);

  const execute = useCallback(async (): Promise<string | null> => {
    if (!wallet.connected) {
      setVisible(true);
      return null;
    }
    if (!poolId || !quote) {
      toast.error("Quote inválido. Atualize o valor e tente novamente.");
      return null;
    }

    setExec(true);
    setError(null);
    const toastId = direction === "buy" ? "swap-buy" : "swap-sell";
    toast.loading(
      direction === "buy" ? "Comprando tokens..." : "Vendendo tokens...",
      { id: toastId }
    );

    try {
      const signature = await executeSwap(connection, wallet, {
        poolId,
        direction,
        amountIn,
        slippagePct,
      }, quote);

      toast.dismiss(toastId);
      toast.success(
        direction === "buy"
          ? `Compra confirmada! +${quote.amountOut.toFixed(2)} tokens`
          : `Venda confirmada! +${quote.amountOut.toFixed(4)} SOL`,
        { duration: 6000 }
      );

      // Record in DB (non-blocking)
      if (wallet.publicKey) {
        recordTrade({
          mintAddress,
          traderWallet: wallet.publicKey.toBase58(),
          direction,
          amountIn,
          amountOut:   quote.amountOut,
          feeSol:      quote.fee,
          priceSol:    direction === "buy"
            ? amountIn / quote.amountOut
            : quote.amountOut / amountIn,
          txSignature: signature,
        }).catch(() => {
          // Non-critical — trade happened on-chain regardless
        });
      }

      return signature;
    } catch (err) {
      toast.dismiss(toastId);
      const msg = err instanceof Error ? err.message : "Transação falhou";
      toast.error(msg);
      setError(msg);
      return null;
    } finally {
      setExec(false);
    }
  }, [wallet, connection, poolId, quote, direction, amountIn, slippagePct, mintAddress, setVisible]);

  return {
    quote,
    quoteLoading,
    executing,
    error,
    execute,
  };
}
