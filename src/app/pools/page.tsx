import type { Metadata } from "next";
import { Droplets, Info } from "lucide-react";
import { PoolsListClient } from "@/components/pools/PoolsListClient";

export const metadata: Metadata = {
  title: "Liquidity Pools",
  description: "Provide liquidity to Navorix pools and earn trading fees on every swap.",
};

export default function PoolsPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="h-6 w-6 text-[var(--gold)]" />
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
            Liquidity Pools
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Provide SOL + token liquidity and earn 1% on every trade.
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <Info className="h-4 w-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          <span className="font-semibold text-[var(--text-secondary)]">How it works:</span>{" "}
          Pools use a constant-product AMM (x × y = k). When you add liquidity you receive
          LP tokens representing your share. Fees are distributed proportionally to LP holders.
          Bonding curve pools graduate to open market when they reach a liquidity threshold.
        </p>
      </div>

      <PoolsListClient />
    </div>
  );
}
