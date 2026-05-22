import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { TokenCreatorForm } from "@/components/token/TokenCreatorForm";

export const metadata: Metadata = {
  title: "Create Token",
  description: "Launch your own SPL token on Solana in seconds with Navorix Exchange.",
};

export default function CreateTokenPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#d97706] mb-4 shadow-[0_0_24px_rgba(251,191,36,0.3)]">
          <Plus className="h-7 w-7 text-[#08080f]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
          Create SPL Token
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Launch your own meme coin or utility token on Solana. No coding required.
          All transactions are real and on-chain.
        </p>
      </div>

      <TokenCreatorForm />
    </div>
  );
}
