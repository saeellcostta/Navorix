"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, ExternalLink, TrendingUp, Wallet } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useSolBalance } from "@/hooks/useSolBalance";
import { getTokenAccounts } from "@/services/solana/tokenService";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { shortenAddress, formatCompact } from "@/utils/format";
import { useLanguage } from "@/contexts/LanguageContext";

interface TokenHolding { mintAddress: string; balance: number; decimals: number; rawAmount: string; }

export function PortfolioClient() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { balance, loading: solLoading, refresh: refreshSol } = useSolBalance();
  const { t } = useLanguage();
  const [holdings, setHoldings]     = useState<TokenHolding[]>([]);
  const [tokLoading, setTokLoading] = useState(false);

  const loadHoldings = async () => {
    if (!publicKey) return;
    setTokLoading(true);
    try {
      const accounts = await getTokenAccounts(connection, publicKey);
      setHoldings(accounts);
    } catch { setHoldings([]); }
    finally { setTokLoading(false); }
  };

  useEffect(() => {
    if (connected && publicKey) loadHoldings();
    else setHoldings([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-3)] border border-[var(--border)]">
          <Wallet className="h-8 w-8 text-[var(--text-muted)]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[var(--text-primary)]">{t.portfolio.connectTitle}</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{t.portfolio.connectDesc}</p>
        </div>
        <ConnectWalletButton size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-[var(--text-muted)]">{publicKey?.toBase58()}</p>
        <button
          onClick={() => { refreshSol(); loadHoldings(); }}
          className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t.portfolio.refresh}
        </button>
      </div>

      <Card className="border-[var(--gold)]/20">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">{t.portfolio.solBalance}</p>
              {solLoading ? (
                <Skeleton className="h-9 w-36" />
              ) : (
                <p className="text-3xl font-extrabold text-[var(--text-primary)] tabular-nums">
                  {balance?.toFixed(4) ?? "—"}
                  <span className="text-lg text-[var(--text-muted)] ml-2 font-medium">SOL</span>
                </p>
              )}
            </div>
            <a href={`https://solscan.io/account/${publicKey?.toBase58()}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[var(--gold)] hover:underline">
              {t.common.solscan} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.portfolio.tokenHoldings}</CardTitle>
          {holdings.length > 0 && <span className="text-xs text-[var(--text-muted)]">{holdings.length}</span>}
        </CardHeader>
        <CardBody className="p-0">
          {tokLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : holdings.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-[var(--text-muted)]">{t.portfolio.noTokens}</p>
              <Link href="/tokens" className="inline-flex items-center gap-1.5 text-xs text-[var(--gold)] hover:underline">
                <TrendingUp className="h-3.5 w-3.5" />
                {t.portfolio.buyOnMarket}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {holdings.map(h => (
                <Link key={h.mintAddress} href={`/token/${h.mintAddress}`}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--surface-2)] transition-colors">
                  <div className="h-9 w-9 rounded-xl bg-[var(--gold-dim)] border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[var(--gold)]">{h.mintAddress.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-[var(--text-secondary)] truncate">{shortenAddress(h.mintAddress)}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{h.decimals} decimais</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">{formatCompact(h.balance)}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{t.portfolio.tokenHoldings.toLowerCase()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">{t.portfolio.tradeHistory}</p>
          <Link href={`/api/trades?wallet=${publicKey?.toBase58()}`} target="_blank"
            className="text-xs text-[var(--gold)] hover:underline flex items-center gap-1">
            {t.portfolio.viewJson} <ExternalLink className="h-3 w-3" />
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
