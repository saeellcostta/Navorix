"use client";

import React, { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { isInsidePhantomBrowser } from "@/lib/phantomMobile";
import { SITE_URL } from "@/config/site";

interface WalletSelectModalProps {
  open: boolean;
  onClose: () => void;
}

// Wallets com logos e links de instalação
const WALLET_INFO: Record<string, { logo: string; installUrl: string; mobileDeepLink?: string }> = {
  Phantom: {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/phantom/src/icon.svg",
    installUrl: "https://phantom.app",
    mobileDeepLink: `https://phantom.app/ul/browse/${encodeURIComponent(SITE_URL)}?ref=${encodeURIComponent(SITE_URL)}`,
  },
  Solflare: {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/solflare/src/icon.svg",
    installUrl: "https://solflare.com",
    mobileDeepLink: `https://solflare.com/ul/v1/connect?app_url=${encodeURIComponent(SITE_URL)}`,
  },
  Backpack: {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/backpack/src/icon.svg",
    installUrl: "https://backpack.app",
  },
  Coinbase: {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/coinbase/src/icon.svg",
    installUrl: "https://www.coinbase.com/wallet",
  },
  "Coinbase Wallet": {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/coinbase/src/icon.svg",
    installUrl: "https://www.coinbase.com/wallet",
  },
  Trust: {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/trust/src/icon.svg",
    installUrl: "https://trustwallet.com",
    mobileDeepLink: `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(SITE_URL)}`,
  },
  "Trust Wallet": {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/trust/src/icon.svg",
    installUrl: "https://trustwallet.com",
    mobileDeepLink: `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(SITE_URL)}`,
  },
  Bitget: {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/bitget/src/icon.svg",
    installUrl: "https://web3.bitget.com",
  },
  "Bitget Wallet": {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/bitget/src/icon.svg",
    installUrl: "https://web3.bitget.com",
  },
  Ledger: {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/ledger/src/icon.svg",
    installUrl: "https://www.ledger.com",
  },
  Torus: {
    logo: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/torus/src/icon.svg",
    installUrl: "https://tor.us",
  },
};

export function WalletSelectModal({ open, onClose }: WalletSelectModalProps) {
  const { wallets, select, connecting } = useWallet();
  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Fechar com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Travar scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleSelect = (walletName: string) => {
    const info = WALLET_INFO[walletName];

    // Mobile: se tem deep link e não está no Phantom browser
    if (isMobile && !isInsidePhantomBrowser() && info?.mobileDeepLink) {
      window.location.href = info.mobileDeepLink;
      onClose();
      return;
    }

    // Desktop: usa wallet adapter para conectar
    select(walletName as Parameters<typeof select>[0]);
    onClose();
  };

  // Separa carteiras detectadas (instaladas) das não detectadas
  const installed     = wallets.filter(w => w.readyState === "Installed" || w.readyState === "Loadable");
  const notInstalled  = wallets.filter(w => w.readyState !== "Installed" && w.readyState !== "Loadable");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel — sheet no mobile, modal no desktop */}
      <div className={cn(
        "relative w-full z-10",
        "sm:max-w-sm",
        "rounded-t-2xl sm:rounded-2xl",
        "border-t sm:border border-[var(--border-strong)]",
        "bg-[var(--surface-2)]",
        "shadow-2xl shadow-black/60",
        "max-h-[85dvh] overflow-y-auto"
      )}>
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[var(--border-strong)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Conectar Carteira</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Escolha sua carteira Solana</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Carteiras instaladas / detectadas */}
          {installed.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
                Detectadas
              </p>
              <div className="space-y-1">
                {installed.map((wallet) => {
                  const info = WALLET_INFO[wallet.adapter.name] ?? WALLET_INFO[wallet.adapter.name.split(" ")[0]];
                  return (
                    <button
                      key={wallet.adapter.name}
                      onClick={() => handleSelect(wallet.adapter.name)}
                      disabled={connecting}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 bg-[var(--surface-3)] hover:bg-[var(--surface-4,#1c1c38)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all duration-150 cursor-pointer disabled:opacity-60"
                    >
                      {/* Logo */}
                      <div className="h-9 w-9 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
                        {info?.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={wallet.adapter.icon || info.logo} alt={wallet.adapter.name} className="h-8 w-8 object-contain" />
                        ) : (
                          <span className="text-sm font-bold text-black">{wallet.adapter.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{wallet.adapter.name}</p>
                        <p className="text-[10px] text-[var(--positive)]">Detectada</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-[var(--positive)] shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Todas as carteiras */}
          <div>
            {installed.length > 0 && (
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
                Outras carteiras
              </p>
            )}
            <div className="space-y-1">
              {(installed.length > 0 ? notInstalled : wallets).map((wallet) => {
                const info = WALLET_INFO[wallet.adapter.name] ?? WALLET_INFO[wallet.adapter.name.split(" ")[0]];
                return (
                  <button
                    key={wallet.adapter.name}
                    onClick={() => handleSelect(wallet.adapter.name)}
                    disabled={connecting}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-[var(--surface-3)] border border-transparent hover:border-[var(--border)] transition-all duration-150 cursor-pointer disabled:opacity-60"
                  >
                    {/* Logo */}
                    <div className="h-9 w-9 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
                      {wallet.adapter.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="h-8 w-8 object-contain" />
                      ) : info?.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={info.logo} alt={wallet.adapter.name} className="h-8 w-8 object-contain" />
                      ) : (
                        <span className="text-sm font-bold text-black">{wallet.adapter.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{wallet.adapter.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {isMobile && info?.mobileDeepLink ? "Abrir app" : "Instalar extensão"}
                      </p>
                    </div>
                    {info?.installUrl && (
                      <ExternalLink className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nota de segurança */}
          <p className="text-center text-[10px] text-[var(--text-muted)] px-2 pb-1">
            Ao conectar você confirma que leu e aceita os Termos de Uso.
            A Navorix nunca pede sua seed phrase.
          </p>
        </div>
      </div>
    </div>
  );
}
