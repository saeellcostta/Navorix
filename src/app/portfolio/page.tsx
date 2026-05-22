import type { Metadata } from "next";
import { Wallet } from "lucide-react";
import { PortfolioClient } from "@/components/dashboard/PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "View your connected wallet balances, token positions and trade history.",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="h-6 w-6 text-[var(--gold)]" />
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Portfolio</h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Your wallet balances, token positions and trade history.
        </p>
      </div>
      <PortfolioClient />
    </div>
  );
}
