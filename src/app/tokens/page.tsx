import type { Metadata } from "next";
import { Coins } from "lucide-react";
import { TokensGrid } from "@/components/marketplace/TokensGrid";

export const metadata: Metadata = {
  title: "Token Marketplace",
  description: "Browse and trade all SPL tokens launched on Navorix Exchange.",
};

export default function TokensPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="h-6 w-6 text-[var(--gold)]" />
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
            Token Marketplace
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Discover, buy and sell SPL tokens on the Solana blockchain.
        </p>
      </div>

      <TokensGrid />
    </div>
  );
}
