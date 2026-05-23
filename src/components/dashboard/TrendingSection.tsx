"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Flame, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTokens } from "@/hooks/useTokens";
import type { TokenListItem } from "@/types/token";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatMarketCap(value: number): string {
  if (!value) return "$0";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

// ─── Card do carrossel ────────────────────────────────────────────────────────
function TrendingCard({ token, rank }: { token: TokenListItem; rank: number }) {
  const change = token.stats?.priceChange24h ?? 0;
  const isPositive = change >= 0;
  const marketCap = token.stats?.marketCap ?? 0;

  const hasBanner = !!token.bannerUrl;
  const hasLogo   = !!token.imageUrl;

  return (
    <Link href={`/token/${token.mintAddress}`} style={{ textDecoration: "none" }}>
      <div className="tc-card">

        {/* ── Banner ── */}
        <div className="tc-banner">

          {hasBanner ? (
            /* Token tem banner real → exibe normalmente */
            <img src={token.bannerUrl} alt={token.name} className="tc-banner-img" />
          ) : hasLogo ? (
            /* Sem banner mas tem logo → logo esticada com blur como fundo */
            <>
              {/* Camada de fundo: logo esticada + blur */}
              <img
                src={token.imageUrl}
                alt=""
                aria-hidden
                className="tc-banner-blur-bg"
              />
              {/* Logo centralizada por cima */}
              <img
                src={token.imageUrl}
                alt={token.name}
                className="tc-banner-logo-center"
              />
            </>
          ) : (
            /* Sem imagem nenhuma → placeholder com símbolo */
            <div className="tc-banner-placeholder">
              <span className="tc-symbol-ghost">${token.symbol}</span>
            </div>
          )}

          <div className="tc-overlay" />

          {/* Rank badge */}
          <div className="tc-rank">
            {rank <= 3 && <Flame size={9} className="tc-rank-fire" />}
            #{rank}
          </div>

          {/* Market cap + variação */}
          <div className="tc-footer">
            <span className="tc-mcap">{formatMarketCap(marketCap)}</span>
            <span className={`tc-change ${isPositive ? "tc-up" : "tc-down"}`}>
              {isPositive ? "↑" : "↓"}{Math.abs(change).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="tc-info">
          <div className="tc-avatar">
            {hasLogo ? (
              <img src={token.imageUrl} alt={token.symbol} className="tc-avatar-img" />
            ) : (
              <div className="tc-avatar-fallback">{token.symbol.slice(0, 2)}</div>
            )}
          </div>
          <div className="tc-meta">
            <p className="tc-name">{token.name}</p>
            <p className="tc-desc">
              {token.description
                ? token.description.slice(0, 55) + (token.description.length > 55 ? "…" : "")
                : `$${token.symbol} on Solana`}
            </p>
          </div>
        </div>

      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="tc-card tc-skeleton">
      <div className="tc-banner tc-sk-banner" />
      <div className="tc-info">
        <div className="tc-sk-avatar" />
        <div className="tc-sk-lines">
          <div className="tc-sk-line" style={{ width: "6rem" }} />
          <div className="tc-sk-line" style={{ width: "9rem" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Seção principal ──────────────────────────────────────────────────────────
export function TrendingSection() {
  const { tokens, loading, error } = useTokens({ sort: "trending", limit: 12 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => el.removeEventListener("scroll", updateArrows);
  }, [tokens]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        .tc-card {
          flex: 0 0 210px;
          scroll-snap-align: start;
          border-radius: 14px;
          overflow: hidden;
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .tc-card:hover {
          transform: translateY(-4px);
          border-color: rgba(251,191,36,0.28);
          box-shadow: 0 10px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(251,191,36,0.1);
        }

        /* ── Banner container ── */
        .tc-banner {
          position: relative;
          width: 100%; height: 144px;
          overflow: hidden;
          background: #13132a;
        }

        /* Banner real (token tem banner_url) */
        .tc-banner-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .tc-card:hover .tc-banner-img { transform: scale(1.07); }

        /* Logo esticada com blur como fundo */
        .tc-banner-blur-bg {
          position: absolute;
          inset: -10px;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          object-fit: cover;
          filter: blur(18px) brightness(0.45) saturate(1.4);
          transform: scale(1.05);
          transition: transform 0.35s ease;
        }
        .tc-card:hover .tc-banner-blur-bg { transform: scale(1.12); }

        /* Logo centralizada por cima do blur */
        .tc-banner-logo-center {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 72px; height: 72px;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.12);
          box-shadow: 0 4px 24px rgba(0,0,0,0.6);
          transition: transform 0.35s ease;
          z-index: 1;
        }
        .tc-card:hover .tc-banner-logo-center {
          transform: translate(-50%, -50%) scale(1.08);
        }

        /* Placeholder sem imagem */
        .tc-banner-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #13132a 0%, #1c1c38 100%);
        }
        .tc-symbol-ghost {
          font-size: 2rem; font-weight: 800;
          color: rgba(251,191,36,0.12); letter-spacing: -0.04em;
        }

        /* Overlay gradiente (em cima de tudo) */
        .tc-overlay {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(to bottom, transparent 20%, rgba(8,8,15,0.75) 100%);
        }

        /* Rank badge */
        .tc-rank {
          position: absolute; top: 0.5rem; left: 0.5rem; z-index: 3;
          display: flex; align-items: center; gap: 0.2rem;
          font-size: 0.6875rem; font-weight: 700; color: #fbbf24;
          background: rgba(8,8,15,0.72);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 999px; padding: 0.2rem 0.5rem;
        }
        .tc-rank-fire { color: #fb923c; }

        /* Market cap + variação */
        .tc-footer {
          position: absolute; bottom: 0.6rem; left: 0.6rem; right: 0.6rem;
          display: flex; align-items: flex-end; justify-content: space-between;
          z-index: 3;
        }
        .tc-mcap {
          font-size: 1.05rem; font-weight: 800; color: #f9fafb;
          text-shadow: 0 1px 8px rgba(0,0,0,0.9);
        }
        .tc-change {
          font-size: 0.6875rem; font-weight: 700;
          border-radius: 999px; padding: 0.15rem 0.45rem;
        }
        .tc-up   { background: rgba(34,197,94,0.18);  color: #4ade80; border: 1px solid rgba(34,197,94,0.22); }
        .tc-down { background: rgba(239,68,68,0.18);   color: #f87171; border: 1px solid rgba(239,68,68,0.22); }

        /* Info inferior */
        .tc-info {
          display: flex; align-items: flex-start;
          gap: 0.6rem; padding: 0.7rem;
        }
        .tc-avatar {
          flex-shrink: 0; width: 1.875rem; height: 1.875rem;
          border-radius: 50%; overflow: hidden;
          border: 1.5px solid rgba(255,255,255,0.08);
        }
        .tc-avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .tc-avatar-fallback {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #1c1c38, #2d2d5a);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem; font-weight: 700; color: #fbbf24;
        }
        .tc-meta { min-width: 0; flex: 1; }
        .tc-name {
          font-size: 0.8125rem; font-weight: 700; color: #f9fafb;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin: 0 0 0.2rem 0;
        }
        .tc-desc {
          font-size: 0.6875rem; color: #6b7280; line-height: 1.35; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        /* Scroll container */
        .tc-scroll {
          display: flex; gap: 0.875rem;
          overflow-x: auto; scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 0.5rem; scrollbar-width: none;
        }
        .tc-scroll::-webkit-scrollbar { display: none; }

        /* Skeleton */
        .tc-skeleton { pointer-events: none; }
        @keyframes tcShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .tc-sk-banner {
          background: linear-gradient(90deg, #0d0d1a 25%, #1c1c38 50%, #0d0d1a 75%);
          background-size: 200% 100%; animation: tcShimmer 1.5s infinite;
        }
        .tc-sk-avatar {
          flex-shrink: 0; width: 1.875rem; height: 1.875rem; border-radius: 50%;
          background: linear-gradient(90deg, #0d0d1a 25%, #1c1c38 50%, #0d0d1a 75%);
          background-size: 200% 100%; animation: tcShimmer 1.5s infinite;
        }
        .tc-sk-lines { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; padding-top: 0.25rem; }
        .tc-sk-line {
          height: 0.6rem; border-radius: 4px;
          background: linear-gradient(90deg, #0d0d1a 25%, #1c1c38 50%, #0d0d1a 75%);
          background-size: 200% 100%; animation: tcShimmer 1.5s infinite;
        }

        /* Setas */
        .tc-arrow {
          display: flex; align-items: center; justify-content: center;
          width: 2rem; height: 2rem; border-radius: 50%;
          border: 1px solid rgba(251,191,36,0.2);
          background: rgba(251,191,36,0.05);
          color: #9ca3af; cursor: pointer; transition: all 0.15s;
        }
        .tc-arrow:hover:not(:disabled) {
          border-color: rgba(251,191,36,0.5); color: #fbbf24;
          background: rgba(251,191,36,0.1);
        }
        .tc-arrow:disabled { opacity: 0.3; cursor: default; }

        /* Vazio */
        .tc-empty {
          width: 100%; height: 180px;
          display: flex; align-items: center; justify-content: center;
          color: #4b5563; font-size: 0.875rem;
          border: 1px dashed rgba(255,255,255,0.06); border-radius: 14px;
        }
      `}</style>

      <section className="px-4 pb-12">
        <div className="mx-auto max-w-screen-xl">

          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-[var(--gold)]" />
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Em alta agora</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/trending" className="flex items-center gap-1 text-sm text-[var(--gold)] hover:underline">
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="flex gap-1.5">
                <button className="tc-arrow" onClick={() => scroll("left")} disabled={!canLeft} aria-label="Anterior">
                  <ChevronLeft size={14} />
                </button>
                <button className="tc-arrow" onClick={() => scroll("right")} disabled={!canRight} aria-label="Próximo">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Carrossel */}
          {error ? (
            <div className="rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 p-6 text-center text-sm text-[#ef4444]">
              {error}
            </div>
          ) : (
            <div className="tc-scroll" ref={scrollRef}>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
                : tokens.length === 0
                  ? <div className="tc-empty">Nenhum token em destaque ainda.</div>
                  : tokens.map((token, i) => (
                      <TrendingCard key={token.mintAddress} token={token} rank={i + 1} />
                    ))
              }
            </div>
          )}

        </div>
      </section>
    </>
  );
}
