"use client";

import React, { useState } from "react";
import { Wallet, ChevronDown, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useNavorixWallet } from "@/contexts/WalletContext";
import { useSolBalance } from "@/hooks/useSolBalance";
import { cn } from "@/lib/utils";

export function WalletButton() {
  const { connected, connecting, publicKeyStr, shortAddress, disconnectWallet } =
    useNavorixWallet();
  const { setVisible } = useWalletModal();
  const { balance } = useSolBalance();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = () => setVisible(true);

  const copyAddress = async () => {
    if (!publicKeyStr) return;
    await navigator.clipboard.writeText(publicKeyStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!connected) {
    return (
      <button
        onClick={handleConnect}
        disabled={connecting}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2",
          "border border-[var(--border-strong)] text-[var(--gold)] text-sm font-semibold",
          "bg-[var(--gold-dim)] hover:bg-[rgba(251,191,36,0.2)]",
          "transition-all duration-200 hover:shadow-[var(--gold-glow)]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "cursor-pointer"
        )}
      >
        <Wallet className="h-4 w-4" />
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>
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
          "transition-all duration-200",
          "cursor-pointer"
        )}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#fbbf24] to-[#d97706]">
          <Wallet className="h-3.5 w-3.5 text-[#08080f]" />
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

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute right-0 top-full mt-2 z-40 w-56",
              "rounded-xl border border-[var(--border-strong)] bg-[var(--surface-2)]",
              "shadow-2xl shadow-black/60",
              "py-1"
            )}
          >
            {/* Wallet info */}
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] mb-1">Connected wallet</p>
              <p className="text-sm font-mono text-[var(--gold)] break-all">{shortAddress}</p>
              {balance !== null && (
                <p className="text-sm font-bold text-[var(--text-primary)] mt-1">
                  {balance.toFixed(4)} SOL
                </p>
              )}
            </div>

            {/* Actions */}
            <button
              onClick={copyAddress}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)] transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[var(--positive)]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy address"}
            </button>

            <a
              href={`https://solscan.io/account/${publicKeyStr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <ExternalLink className="h-4 w-4" />
              View on Solscan
            </a>

            <div className="my-1 border-t border-[var(--border)]" />

            <button
              onClick={() => {
                disconnectWallet();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
