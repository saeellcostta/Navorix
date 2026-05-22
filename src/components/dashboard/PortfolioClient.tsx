"use client";

import React from "react";
import { AlertTriangle, Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useSolBalance } from "@/hooks/useSolBalance";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { shortenAddress } from "@/utils/format";

export function PortfolioClient() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { balance, loading } = useSolBalance();

  if (!connected) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-3)] border border-[var(--border)]">
          <Wallet className="h-8 w-8 text-[var(--text-muted)]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[var(--text-primary)]">
            Connect your wallet
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Connect to see your SOL balance, tokens and positions.
          </p>
        </div>
        <Button onClick={() => setVisible(true)}>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet address */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#fbbf24] to-[#d97706]">
              <Wallet className="h-5 w-5 text-[#08080f]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Connected address</p>
              <p className="text-sm font-mono text-[var(--gold)]">
                {publicKey?.toBase58() ?? "—"}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* SOL Balance */}
      <Card>
        <CardHeader>
          <CardTitle>SOL Balance</CardTitle>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <p className="text-3xl font-extrabold text-[var(--text-primary)] tabular-nums">
              {balance?.toFixed(4) ?? "—"}
              <span className="text-lg text-[var(--text-muted)] ml-2">SOL</span>
            </p>
          )}
        </CardBody>
      </Card>

      {/* Token holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Token Holdings</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <AlertTriangle className="h-8 w-8 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">
              Token balance loading — wire up{" "}
              <code className="text-[var(--gold)] text-xs">getTokenAccounts()</code> from{" "}
              <code className="text-xs text-[var(--text-secondary)]">
                src/services/solana/tokenService.ts
              </code>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
