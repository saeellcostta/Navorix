"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, RefreshCw, ExternalLink, TrendingUp } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useSolBalance } from "@/hooks/useSolBalance";
import { getTokenAccounts } from "@/services/solana/tokenService";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { shortenAddress, formatCompact } from "@/utils/format";

interface TokenHolding {
  mintAddress: string;
  balance: number;
  decimals: number;
  rawAmount: string;
}

export function PortfolioClient() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  const { balance, loading: solLoading, refresh: refreshSol } = useSolBalance();

  const [holdings, setHoldings]     = useState<TokenHolding[]>([]);
  const [tokLoading, setTokLoading] = useState(false);

  const loadHoldings = async () => {
    if (!publicKey) return;
    setTokLoading(true);
    try {
      const accounts = await getTokenAccounts(connection, publicKey);
      setHoldings(accounts);
    } catch {
      setHoldings([]);
    } finally {
      setTokLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) loadHoldings();
    else setHoldings([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey]);

  const handleRefresh = () => {
    refreshSol();
    loadHoldings();
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-3)] border border-[var(--border)]">
          <Wallet className="h-8 w-8 text-[var(--text-muted)]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[var(--text-primary)]">Conecte sua carteira</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Veja saldo SOL, tokens e histórico de trades.
          </p>
        </div>
        <Button onClick={() => setVisible(true)}>
          <Wallet className="h-4 w-4" />
          Conectar Carteira
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com refresh */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-[var(--text-muted)]">{publicKey?.toBase58()}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Atualizar
        </button>
      </div>

      {/* SOL Balance */}
      <Card className="border-[var(--gold)]/20">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Saldo SOL</p>
              {solLoading ? (
                <Skeleton className="h-9 w-36" />
              ) : (
                <p className="text-3xl font-extrabold text-[var(--text-primary)] tabular-nums">
                  {balance?.toFixed(4) ?? "—"}
                  <span className="text-lg text-[var(--text-muted)] ml-2 font-medium">SOL</span>
                </p>
              )}
            </div>
            <a
              href={`https://solscan.io/account/${publicKey?.toBase58()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[var(--gold)] hover:underline"
            >
              Solscan <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardBody>
      </Card>

      {/* Token Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Tokens na Carteira</CardTitle>
          {holdings.length > 0 && (
            <span className="text-xs text-[var(--text-muted)]">{holdings.length} token(s)</span>
          )}
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
              <p className="text-sm text-[var(--text-muted)]">Nenhum token SPL encontrado.</p>
              <Link
                href="/tokens"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--gold)] hover:underline"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Comprar no marketplace
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {holdings.map((h) => (
                <Link
                  key={h.mintAddress}
                  href={`/token/${h.mintAddress}`}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div className="h-9 w-9 rounded-xl bg-[var(--gold-dim)] border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[var(--gold)]">
                      {h.mintAddress.slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-[var(--text-secondary)] truncate">
                      {shortenAddress(h.mintAddress)}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">{h.decimals} decimais</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
                      {formatCompact(h.balance)}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">tokens</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Trade History link */}
      <Card>
        <CardBody className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">Histórico de trades da carteira</p>
          <Link
            href={`/api/trades?wallet=${publicKey?.toBase58()}`}
            target="_blank"
            className="text-xs text-[var(--gold)] hover:underline flex items-center gap-1"
          >
            Ver JSON <ExternalLink className="h-3 w-3" />
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
