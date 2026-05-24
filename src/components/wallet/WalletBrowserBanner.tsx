"use client";

/**
 * WalletBrowserBanner
 *
 * Aparece quando o site é aberto dentro do browser de uma carteira
 * mas a conexão ainda não foi aprovada.
 *
 * Mostra um botão grande "Conectar [Nome da Carteira]" para o usuário aprovar.
 */

import React, { useEffect, useState } from "react";
import { Wallet, X } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

function getWalletFromBrowser(): { name: string; displayName: string } | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const ua = navigator.userAgent;

  if (w.phantom?.solana || ua.includes("Phantom"))   return { name: "Phantom",       displayName: "Phantom" };
  if (w.solflare || ua.includes("Solflare"))          return { name: "Solflare",      displayName: "Solflare" };
  if (w.trustwallet || w.trust || ua.includes("Trust")) return { name: "Trust",       displayName: "Trust Wallet" };
  if (w.bitkeep?.solana || ua.includes("BitKeep") || ua.includes("Bitget")) return { name: "Bitget Wallet", displayName: "Bitget Wallet" };
  if (w.coinbaseSolana || ua.includes("CoinbaseWallet")) return { name: "Coinbase Wallet", displayName: "Coinbase Wallet" };
  if (w.backpack || ua.includes("Backpack"))          return { name: "Backpack",      displayName: "Backpack" };

  return null;
}

export function WalletBrowserBanner() {
  const { connected, connecting, select, connect } = useWallet();
  const { t } = useLanguage();
  const [wallet, setWallet]     = useState<{ name: string; displayName: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const detected = getWalletFromBrowser();
    setWallet(detected);
  }, []);

  // Não mostrar se já conectado, dispensado, ou não está num browser de carteira
  if (!wallet || connected || dismissed) return null;

  const handleConnect = async () => {
    setLoading(true);
    try {
      select(wallet.name as Parameters<typeof select>[0]);
      await new Promise(r => setTimeout(r, 400));
      await connect();
    } catch (err) {
      console.warn("Connect failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "border-t border-[var(--border-strong)]",
      "bg-[var(--surface-2)] backdrop-blur-md",
      "px-4 py-4 pb-safe",
      "flex items-center gap-3"
    )}>
      {/* Ícone */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#fbbf24] to-[#d97706] shrink-0">
        <Wallet className="h-5 w-5 text-[#08080f]" />
      </div>

      {/* Texto + botão */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--text-muted)] leading-tight">
          {wallet.displayName} detectada
        </p>
        <button
          onClick={handleConnect}
          disabled={loading || connecting}
          className={cn(
            "mt-1.5 w-full rounded-lg py-2.5 text-sm font-bold",
            "bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#08080f]",
            "hover:from-[#fcd34d] hover:to-[#f59e0b]",
            "disabled:opacity-60 cursor-pointer transition-all",
            "shadow-[0_0_16px_rgba(251,191,36,0.3)]"
          )}
        >
          {loading || connecting
            ? t.wallet.connecting
            : `${t.wallet.connect} — ${wallet.displayName}`}
        </button>
      </div>

      {/* Fechar */}
      <button
        onClick={() => setDismissed(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--text-muted)] shrink-0 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
