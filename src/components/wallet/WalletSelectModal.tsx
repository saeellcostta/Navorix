"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { X, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";

interface WalletSelectModalProps {
  open: boolean;
  onClose: () => void;
}

interface WalletMeta {
  icon:         string;
  installUrl:   string;
  mobileDeepLink?: string;
  label?:       string;
}

const enc = encodeURIComponent;

const WALLET_META: Record<string, WalletMeta> = {
  Phantom: {
    icon:           "https://187760183-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MVOiF6Zqit57qRLGSYx-1972196547%2Fuploads%2FhFJoQPXavTLMFQFb9sVj%2Fimage.png?alt=media&token=56185571-94a7-4fe4-b1df-6ec5e53f2571",
    installUrl:     "https://phantom.app/download",
    mobileDeepLink: `https://phantom.app/ul/browse/${enc(SITE_URL)}?ref=${enc(SITE_URL)}`,
  },
  Solflare: {
    icon:           "https://solflare.com/assets/logo.svg",
    installUrl:     "https://solflare.com/download",
    mobileDeepLink: `https://solflare.com/ul/browse/${enc(SITE_URL)}`,
  },
  Backpack: {
    icon:           "https://backpack.app/apple-touch-icon.png",
    installUrl:     "https://backpack.app",
  },
  "Coinbase Wallet": {
    icon:           "https://www.coinbase.com/img/favicon/apple-touch-icon.png",
    installUrl:     "https://www.coinbase.com/wallet/downloads",
    mobileDeepLink: `https://go.cb-w.com/dapp?cb_url=${enc(SITE_URL)}`,
  },
  Coinbase: {
    icon:           "https://www.coinbase.com/img/favicon/apple-touch-icon.png",
    installUrl:     "https://www.coinbase.com/wallet/downloads",
    mobileDeepLink: `https://go.cb-w.com/dapp?cb_url=${enc(SITE_URL)}`,
  },
  "Trust Wallet": {
    icon:           "https://trustwallet.com/assets/images/favicon.png",
    installUrl:     "https://trustwallet.com/download",
    mobileDeepLink: `https://link.trustwallet.com/open_url?coin_id=501&url=${enc(SITE_URL)}`,
    label:          "Trust Wallet",
  },
  Trust: {
    icon:           "https://trustwallet.com/assets/images/favicon.png",
    installUrl:     "https://trustwallet.com/download",
    mobileDeepLink: `https://link.trustwallet.com/open_url?coin_id=501&url=${enc(SITE_URL)}`,
    label:          "Trust Wallet",
  },
  "Bitget Wallet": {
    icon:           "https://web3.bitget.com/favicon.ico",
    installUrl:     "https://web3.bitget.com/en/wallet-download",
    mobileDeepLink: `bitkeep://bkconnect?action=dapp&url=${enc(SITE_URL)}`,
    label:          "Bitget Wallet",
  },
  Bitget: {
    icon:           "https://web3.bitget.com/favicon.ico",
    installUrl:     "https://web3.bitget.com/en/wallet-download",
    mobileDeepLink: `bitkeep://bkconnect?action=dapp&url=${enc(SITE_URL)}`,
    label:          "Bitget Wallet",
  },
  Ledger: {
    icon:           "https://www.ledger.com/wp-content/uploads/2021/11/Ledger_favicon.png",
    installUrl:     "https://www.ledger.com/ledger-live/download",
    label:          "Ledger (hardware)",
  },
};

const WALLETCONNECT_INFO: WalletMeta = {
  icon:        "https://avatars.githubusercontent.com/u/37784886",
  installUrl:  "https://walletconnect.com",
  label:       "WalletConnect (QR Code)",
};

const SHOW_WALLETS = [
  "Phantom",
  "Solflare",
  "Backpack",
  "Coinbase Wallet",
  "Trust",
  "Bitget Wallet",
  "Ledger",
  "WalletConnect",
];

export function WalletSelectModal({ open, onClose }: WalletSelectModalProps) {
  const { wallets, select, connect, connecting, disconnect, connected } = useWallet();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [isPhantomBrowser, setIsPhantomBrowser] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<{ name: string; meta: WalletMeta } | null>(null);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    setIsPhantomBrowser(navigator.userAgent.includes("Phantom") || navigator.userAgent.includes("Solflare"));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) setSelectedWallet(null);
  }, [open]);

  if (!open) return null;

  const visibleWallets = wallets.filter(w =>
    SHOW_WALLETS.some(name => w.adapter.name.includes(name) || name.includes(w.adapter.name))
  );

  const shownNames = new Set(visibleWallets.map(w => w.adapter.name));
  const extraWallets = SHOW_WALLETS
    .filter(name => ![...shownNames].some(n => n.includes(name) || name.includes(n)))
    .map(name => ({ adapter: { name, icon: "" }, readyState: "NotDetected" as const }));

  const allWallets = [...visibleWallets, ...extraWallets];
  const installed    = allWallets.filter(w => w.readyState === "Installed" || w.readyState === "Loadable");
  const notInstalled = allWallets.filter(w => w.readyState !== "Installed" && w.readyState !== "Loadable");

  const handleSelect = async (walletName: string, readyState: string) => {
    const meta = WALLET_META[walletName] ?? null;
    const isInstalled = readyState === "Installed" || readyState === "Loadable";
    const isWC = walletName === "WalletConnect";

    if (connected) {
      try { await disconnect(); } catch { /* ignore */ }
    }

    if (isInstalled || isWC || isPhantomBrowser) {
      select(walletName as Parameters<typeof select>[0]);
      onClose();
      setTimeout(() => {
        connect().catch(() => {});
      }, 150);
      return;
    }

    if (isMobile && meta) {
      setSelectedWallet({ name: walletName, meta });
      return;
    }

    if (meta?.installUrl) {
      window.open(meta.installUrl, "_blank", "noopener");
    }
    onClose();
  };

  const WalletRow = ({ wallet, isInstalled }: { wallet: typeof allWallets[0]; isInstalled: boolean }) => {
    const name = wallet.adapter.name;
    const meta = WALLET_META[name] ?? WALLET_META[name.split(" ")[0]] ?? null;
    const isWC = name === "WalletConnect";
    const icon = wallet.adapter.icon || meta?.icon || (isWC ? WALLETCONNECT_INFO.icon : "") || "";

    return (
      <button
        onClick={() => handleSelect(name, wallet.readyState)}
        disabled={connecting}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-4 py-3",
          "border transition-all duration-150 cursor-pointer",
          "disabled:opacity-60",
          isInstalled
            ? "bg-[var(--surface-3)] border-[var(--border)] hover:border-[var(--border-strong)]"
            : "border-transparent hover:bg-[var(--surface-3)] hover:border-[var(--border)]"
        )}
      >
        <div className="h-10 w-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0 border border-gray-100">
          {icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon} alt={name} className="h-8 w-8 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <span className="text-base font-bold text-gray-800">{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {meta?.label ?? (isWC ? WALLETCONNECT_INFO.label : name)}
          </p>
          <p className={cn("text-[10px]",
            isInstalled ? "text-[var(--positive)]" : "text-[var(--text-muted)]"
          )}>
            {isInstalled ? `${t.wallet.detected} ✓` : isMobile ? t.wallet.openApp : t.wallet.installExtension}
          </p>
        </div>
        {isInstalled ? (
          <div className="h-2.5 w-2.5 rounded-full bg-[var(--positive)] shrink-0" />
        ) : (
          <Download className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
        )}
      </button>
    );
  };

  if (selectedWallet) {
    const { name, meta } = selectedWallet;
    const icon = WALLET_META[name]?.icon || "";
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className={cn(
          "relative w-full z-10 sm:max-w-sm",
          "rounded-t-2xl sm:rounded-2xl",
          "border-t sm:border border-[var(--border-strong)]",
          "bg-[var(--surface-2)] shadow-2xl shadow-black/60"
        )}>
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-[var(--border-strong)]" />
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <button onClick={() => setSelectedWallet(null)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
              ← Voltar
            </button>
            <h2 className="text-base font-bold text-[var(--text-primary)]">{meta.label ?? name}</h2>
            <button onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--text-muted)] cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-center py-4">
              {icon && <img src={icon} alt={name} className="h-16 w-16 rounded-2xl" />}
            </div>
            <p className="text-center text-sm text-[var(--text-secondary)]">
              Como você quer conectar com <span className="font-bold text-[var(--text-primary)]">{meta.label ?? name}</span>?
            </p>
            {meta.mobileDeepLink && (
              <button
                onClick={() => { window.location.href = meta.mobileDeepLink!; onClose(); }}
                className="flex w-full items-center gap-3 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold-dim)] px-4 py-3 cursor-pointer"
              >
                <ExternalLink className="h-5 w-5 text-[var(--gold)] shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-bold text-[var(--gold)]">Abrir no app</p>
                  <p className="text-xs text-[var(--text-muted)]">Abre o site dentro do {meta.label ?? name}</p>
                </div>
              </button>
            )}
            <button
              onClick={() => { window.open(meta.installUrl, "_blank", "noopener"); onClose(); }}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-3)] px-4 py-3 cursor-pointer"
            >
              <Download className="h-5 w-5 text-[var(--text-muted)] shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Instalar {meta.label ?? name}</p>
                <p className="text-xs text-[var(--text-muted)]">Baixar o app gratuitamente</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        "relative w-full z-10 sm:max-w-sm",
        "rounded-t-2xl sm:rounded-2xl",
        "border-t sm:border border-[var(--border-strong)]",
        "bg-[var(--surface-2)]",
        "shadow-2xl shadow-black/60",
        "max-h-[85dvh] overflow-y-auto"
      )}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[var(--border-strong)]" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">{t.wallet.chooseWallet}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {installed.length > 0
                ? `${installed.length} ${t.wallet.detected.toLowerCase()}`
                : t.wallet.chooseWallet}
            </p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          {installed.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
                {t.wallet.detected}
              </p>
              <div className="space-y-1">
                {installed.map(w => <WalletRow key={w.adapter.name} wallet={w} isInstalled={true} />)}
              </div>
            </div>
          )}
          <div>
            {installed.length > 0 && (
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
                Outras carteiras
              </p>
            )}
            <div className="space-y-1">
              {notInstalled.map(w => <WalletRow key={w.adapter.name} wallet={w} isInstalled={false} />)}
            </div>
          </div>
          <p className="text-center text-[10px] text-[var(--text-muted)] px-2 pb-2 leading-relaxed">
            A Navorix nunca pede sua seed phrase ou chave privada.
          </p>
        </div>
      </div>
    </div>
  );
}
