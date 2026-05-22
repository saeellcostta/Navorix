import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { TradePanel } from "@/components/token/TradePanel";
import { Badge } from "@/components/ui/Badge";
import { shortenAddress } from "@/utils/format";

interface PageProps {
  params: Promise<{ mint: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mint } = await params;
  return {
    title: `Token ${shortenAddress(mint)} | Navorix Exchange`,
    description: `Trade this SPL token on Navorix Exchange.`,
  };
}

export default async function TokenDetailPage({ params }: PageProps) {
  const { mint } = await params;

  // Validate basic public key format
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
      {/* Back navigation */}
      <Link
        href="/tokens"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info — 2/3 width */}
        <div className="lg:col-span-2 space-y-5">
          {/* Token header */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl border border-[var(--border)] bg-[var(--surface-3)] flex items-center justify-center text-2xl font-bold text-[var(--gold)]">
              ?
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
                Token Details
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="surface">
                  <span className="font-mono text-[10px]">{shortenAddress(mint, 6)}</span>
                </Badge>
                <a
                  href={`https://solscan.io/token/${mint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--gold)] hover:underline"
                >
                  Solscan <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Chart placeholder — wire up recharts + price data here */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-5">
            <p className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Price Chart</p>
            <div className="h-48 flex items-center justify-center text-[var(--text-muted)] text-sm rounded-lg bg-[var(--surface-2)]">
              Chart — wire up Recharts + price feed
            </div>
          </div>

          {/* Token info table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Token Info</p>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {[
                { label: "Mint Address",  value: mint, mono: true },
                { label: "Decimals",      value: "—" },
                { label: "Total Supply",  value: "—" },
                { label: "Holders",       value: "—" },
                { label: "Creator",       value: "—" },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-[var(--text-muted)]">{label}</span>
                  <span
                    className={`text-[var(--text-primary)] ${mono ? "font-mono text-xs" : "font-semibold"}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade panel — 1/3 width */}
        <div>
          <TradePanel mintAddress={mint} tokenSymbol="TOKEN" pool={null} />
        </div>
      </div>
    </div>
  );
}
