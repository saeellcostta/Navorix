"use client";

import React from "react";
import { Receipt, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCompact } from "@/utils/format";
import {
  TOKEN_CREATION_FEE_SOL,
  solToTokensAtLaunch,
  totalLaunchCostSol,
} from "@/config/solana";

interface LaunchCostSummaryProps {
  initialBuySol: number;
  symbol: string;
  walletBalance: number | null;
}

export function LaunchCostSummary({
  initialBuySol,
  symbol,
  walletBalance,
}: LaunchCostSummaryProps) {
  const tokensReceived = solToTokensAtLaunch(initialBuySol);
  const total = totalLaunchCostSol(initialBuySol);
  const gasBuffer = 0.005;
  const required = total + gasBuffer;
  const hasFunds = walletBalance !== null && walletBalance >= required;

  const rows: { label: string; value: string; highlight?: boolean }[] = [
    {
      label: "Taxa de criação (plataforma)",
      value: `${TOKEN_CREATION_FEE_SOL} SOL`,
    },
    ...(initialBuySol > 0
      ? [
          {
            label: `Compra inicial → ${formatCompact(tokensReceived)} $${symbol || "TOKEN"}`,
            value: `${initialBuySol} SOL`,
          },
        ]
      : []),
    {
      label: "Gas estimado (rede Solana)",
      value: `~${gasBuffer} SOL`,
    },
    {
      label: "Total",
      value: `${(total + gasBuffer).toFixed(4)} SOL`,
      highlight: true,
    },
  ];

  return (
    <div
      className={cn(
        "rounded-xl border p-4 space-y-3",
        hasFunds
          ? "border-[var(--positive)]/30 bg-[rgba(34,197,94,0.04)]"
          : walletBalance !== null
            ? "border-[var(--negative)]/30 bg-[rgba(239,68,68,0.04)]"
            : "border-[var(--border)] bg-[var(--surface-2)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-[var(--text-muted)]" />
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Resumo do custo
        </p>
      </div>

      {/* Line items */}
      <div className="space-y-1.5">
        {rows.map(({ label, value, highlight }) => (
          <div
            key={label}
            className={cn(
              "flex items-center justify-between text-sm",
              highlight && "pt-2 mt-1 border-t border-[var(--border)]"
            )}
          >
            <span
              className={cn(
                highlight
                  ? "font-bold text-[var(--text-primary)]"
                  : "text-[var(--text-muted)]"
              )}
            >
              {label}
            </span>
            <span
              className={cn(
                "tabular-nums font-semibold",
                highlight ? "text-[var(--gold)] text-base" : "text-[var(--text-secondary)]"
              )}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Balance check */}
      {walletBalance !== null && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
            hasFunds
              ? "bg-[rgba(34,197,94,0.1)] text-[var(--positive)]"
              : "bg-[rgba(239,68,68,0.1)] text-[var(--negative)]"
          )}
        >
          {hasFunds ? (
            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <span className="font-bold">⚠</span>
          )}
          {hasFunds
            ? `Saldo suficiente · ${walletBalance.toFixed(4)} SOL disponível`
            : `Saldo insuficiente · ${walletBalance.toFixed(4)} SOL (precisa de ~${required.toFixed(4)} SOL)`}
        </div>
      )}
    </div>
  );
}
