import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Users, BarChart3, Droplets, TrendingUp, Rocket, Zap } from "lucide-react";
import { TradePanel } from "@/components/token/TradePanel";
import { PriceChart } from "@/components/token/PriceChart";
import { TradeHistory } from "@/components/token/TradeHistory";
import { AddLiquidityButton } from "@/components/token/AddLiquidityButton";
import { BondingBuyPanel } from "@/components/token/BondingBuyPanel";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { PriceChange } from "@/components/ui/PriceChange";
import { getTokenByMint } from "@/services/db/tokenDbService";
import { getPoolByMint } from "@/services/db/poolDbService";
import { isValidPublicKey } from "@/utils/validation";
import { formatUsd, formatCompact, shortenAddress, timeAgo } from "@/utils/format";
import { Share2, MessageCircle, Globe } from "lucide-react";

interface PageProps {
  params: Promise<{ mint: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mint } = await params;
  try {
    const token = await getTokenByMint(mint);
    if (!token) return { title: "Token não encontrado" };
    return {
      title: `${token.name} ($${token.symbol})`,
      description: token.description || `Compre e venda ${token.name} na Navorix Exchange.`,
      openGraph: { images: token.imageUrl ? [token.imageUrl] : [] },
    };
  } catch {
    return { title: "Token" };
  }
}

export default async function TokenDetailPage({ params }: PageProps) {
  const { mint } = await params;

  if (!isValidPublicKey(mint)) notFound();

  const [token, pool] = await Promise.all([
    getTokenByMint(mint).catch(() => null),
    getPoolByMint(mint).catch(() => null),
  ]);
  if (!token) notFound();

  const stats      = token.stats;
  const isLaunching = token.status === "launching";
  const isLive      = token.status === "live" || token.status === "graduated";

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
      {/* Back */}
      <Link
        href="/tokens"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Banner */}
          {token.bannerUrl && (
            <div className="rounded-xl overflow-hidden h-40 w-full">
              <Image src={token.bannerUrl} alt={`${token.name} banner`} width={900} height={160} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Token header */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-3)] shrink-0">
              {token.imageUrl ? (
                <Image src={token.imageUrl} alt={token.name} width={64} height={64} className="object-cover w-full h-full" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--gold)]">
                  {token.symbol.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">{token.name}</h1>
                <Badge variant="surface">${token.symbol}</Badge>

                {/* Status badge */}
                {isLaunching && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}>
                    <Rocket className="h-3 w-3" /> LAUNCHING
                  </span>
                )}
                {isLive && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }}>
                    <Zap className="h-3 w-3" /> LIVE
                  </span>
                )}

                {stats && stats.priceChange24h > 0 && <Badge variant="new" dot>Hot</Badge>}
              </div>
              {stats && (
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xl font-bold text-[var(--text-primary)] tabular-nums">
                    {formatUsd(stats.price)}
                  </span>
                  <PriceChange value={stats.priceChange24h} size="md" />
                </div>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <a href={`https://solscan.io/token/${mint}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--gold)] hover:underline">
                  {shortenAddress(mint, 6)} <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-xs text-[var(--text-muted)]">Criado {timeAgo(token.createdAt)}</span>
              </div>

              {/* Links sociais */}
              {(token.social?.twitter || token.social?.telegram || token.social?.website || token.social?.discord) && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {token.social.twitter && (
                    <a href={token.social.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors border border-[var(--border)] rounded-full px-2 py-0.5">
                      <Share2 className="h-3 w-3" /> Twitter
                    </a>
                  )}
                  {token.social.telegram && (
                    <a href={token.social.telegram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors border border-[var(--border)] rounded-full px-2 py-0.5">
                      <MessageCircle className="h-3 w-3" /> Telegram
                    </a>
                  )}
                  {token.social.website && (
                    <a href={token.social.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors border border-[var(--border)] rounded-full px-2 py-0.5">
                      <Globe className="h-3 w-3" /> Website
                    </a>
                  )}
                  {token.social.discord && (
                    <a href={token.social.discord} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors border border-[var(--border)] rounded-full px-2 py-0.5">
                      <Users className="h-3 w-3" /> Discord
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Barra de progresso bonding */}
          {isLaunching && (
            <div className="rounded-xl border p-4 space-y-2"
              style={{ borderColor: "rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.04)" }}>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#9ca3af" }}>Progresso até graduação Raydium</span>
                <span style={{ color: "#fbbf24", fontWeight: 700 }}>
                  {token.escrowSol.toFixed(3)} / {token.graduationThresholdSol} SOL
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((token.escrowSol / token.graduationThresholdSol) * 100, 100)}%`,
                    background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                  }} />
              </div>
              <p className="text-xs" style={{ color: "#6b7280" }}>
                Quando atingir {token.graduationThresholdSol} SOL, a pool Raydium é criada e o token fica negociável publicamente.
              </p>
            </div>
          )}

          {/* Stats row */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Market Cap",   value: formatUsd(stats.marketCap, true),  icon: <BarChart3 className="h-4 w-4" /> },
                { label: "Liquidez",     value: formatUsd(stats.liquidity, true),  icon: <Droplets className="h-4 w-4" /> },
                { label: "Volume 24h",   value: formatUsd(stats.volume24h, true),  icon: <TrendingUp className="h-4 w-4" /> },
                { label: "Holders",      value: formatCompact(stats.holders),      icon: <Users className="h-4 w-4" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-3">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1">
                    {icon}
                    <span className="text-[10px] uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="text-base font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Price chart — só mostra se LIVE */}
          {isLive && <PriceChart mintAddress={mint} symbol={token.symbol} />}

          {/* Description */}
          {token.description && (
            <Card>
              <CardHeader><CardTitle>Sobre o Token</CardTitle></CardHeader>
              <CardBody>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{token.description}</p>
              </CardBody>
            </Card>
          )}

          {/* Token info table */}
          <Card>
            <CardHeader><CardTitle>Informações</CardTitle></CardHeader>
            <div className="divide-y divide-[var(--border)]">
              {[
                { label: "Mint Address",   value: mint,                             mono: true },
                { label: "Decimais",       value: String(token.decimals) },
                { label: "Supply Total",   value: formatCompact(token.supply) },
                { label: "Criador",        value: shortenAddress(token.creator, 6), mono: true },
                { label: "Supply inicial", value: formatCompact(token.supply) },
                { label: "Status",         value: token.status.toUpperCase() },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-[var(--text-muted)]">{label}</span>
                  <span className={mono ? "font-mono text-xs text-[var(--gold)]" : "font-semibold text-[var(--text-primary)]"}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Trade history — só mostra se LIVE */}
          {isLive && <TradeHistory mintAddress={mint} />}
        </div>

        {/* ── Right column (1/3) ── */}
        <div className="space-y-4">

          {/* Bonding phase → mostra BondingBuyPanel */}
          {isLaunching ? (
            <BondingBuyPanel
              mintAddress={mint}
              tokenSymbol={token.symbol}
              escrowSol={token.escrowSol}
              graduationThreshold={token.graduationThresholdSol}
            />
          ) : (
            <>
              <TradePanel
                mintAddress={mint}
                tokenSymbol={token.symbol}
                poolId={pool?.raydiumPoolId ?? null}
              />
              <AddLiquidityButton
                mintAddress={mint}
                tokenSymbol={token.symbol}
                solReserve={pool?.solReserve ?? 0}
                tokenReserve={pool?.tokenReserve ?? 0}
              />
            </>
          )}

          {/* Links externos */}
          <Card>
            <CardBody className="flex flex-col gap-2">
              {[
                { label: "Ver no Solscan",  href: `https://solscan.io/token/${mint}` },
                { label: "Ver no Explorer", href: `https://explorer.solana.com/address/${mint}` },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors py-1">
                  {label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
