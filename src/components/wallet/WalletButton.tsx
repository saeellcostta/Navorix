"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { useNavorixWallet } from "@/contexts/WalletContext";
import { useSolBalance } from "@/hooks/useSolBalance";
import { clearPhantomUrlParams } from "@/lib/phantomMobile";
import { WalletSelectModal } from "./WalletSelectModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

function getAvatarUrl(address: string): string {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${address}&backgroundColor=transparent`;
}

export function WalletButton() {
  const { connected, connecting, publicKeyStr, shortAddress, disconnectWallet } =
    useNavorixWallet();
  const { balance } = useSolBalance();
  const { t } = useLanguage();
  const [open, setOpen]           = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied]       = useState(false);

  useEffect(() => {
    clearPhantomUrlParams();
  }, []);

  const copyAddress = async () => {
    if (!publicKeyStr) return;
    await navigator.clipboard.writeText(publicKeyStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!connected) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          disabled={connecting}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2",
            "border border-[var(--border-strong)] text-[var(--gold)] text-sm font-semibold",
            "bg-[var(--gold-dim)] hover:bg-[rgba(251,191,36,0.2)]",
            "transition-all duration-200 hover:shadow-[var(--gold-glow)]",
            "disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          )}
        >
          {connecting ? t.wallet.connecting : t.wallet.connect}
        </button>
        <WalletSelectModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2",
          "border border-[var(--border-strong)] text-[var(--text-primary)] text-sm font-semibold",
          "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]",
          "transition-all duration-200 cursor-pointer"
        )}
      >
        {/* Avatar DiceBear */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full overflow-hidden border border-[var(--gold)]/30 bg-[var(--gold-dim)] shrink-0">
          {publicKeyStr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getAvatarUrl(publicKeyStr)}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col items-start leading-none">
          <span className="text-[var(--gold)] font-mono text-xs">{shortAddress}</span>
          {balance !== null && (
            <span className="text-[var(--text-muted)] text-xs mt-0.5">
              {balance.toFixed(3)} SOL
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-[var(--text-muted)] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className={cn(
            "absolute right-0 top-full mt-2 z-40 w-60",
            "rounded-xl border border-[var(--border-strong)] bg-[var(--surface-2)]",
            "shadow-2xl shadow-black/60 py-1 overflow-hidden"
          )}>
            {/* Avatar grande no topo do dropdown */}
            <div className="flex flex-col items-center gap-2 px-4 py-4 border-b border-[var(--border)] bg-[var(--surface-3)]">
              <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-[var(--gold)]/40 bg-[var(--gold-dim)]">
                {publicKeyStr && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getAvatarUrl(publicKeyStr)}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <p className="text-xs font-mono text-[var(--gold)]">{shortAddress}</p>
              {balance !== null && (
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {balance.toFixed(4)} SOL
                </p>
              )}
            </div>

            <button
              onClick={copyAddress}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-[var(--positive)]" /> : <Copy className="h-4 w-4" />}
              {copied ? t.wallet.copied : t.wallet.copyAddress}
            </button>

            <a
              href={`https://solscan.io/account/${publicKeyStr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <ExternalLink className="h-4 w-4" />
              {t.wallet.viewOnSolscan}
            </a>

            <div className="my-1 border-t border-[var(--border)]" />

            <button
              onClick={() => { disconnectWallet(); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              {t.wallet.disconnect}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
