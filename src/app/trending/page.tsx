import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { TrendingClient } from "@/components/marketplace/TrendingClient";

export const metadata: Metadata = {
  title: "Trending Tokens",
  description: "The hottest SPL tokens on Solana right now, ranked by volume and momentum.",
};

export default function TrendingPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-6 w-6 text-[var(--gold)]" />
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Trending Now</h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Top-performing tokens ranked by 24h volume, market cap growth, and momentum.
        </p>
      </div>
      <TrendingClient />
    </div>
  );
}
