"use client";

import React from "react";
import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PriceChange } from "@/components/ui/PriceChange";
import { formatUsd, formatCompact, shortenAddress } from "@/utils/format";
import type { TokenListItem } from "@/types/token";

interface TokenCardProps {
  token: TokenListItem;
}

export function TokenCard({ token }: TokenCardProps) {
  const stats = token.stats;
  const bgImage = token.bannerUrl || token.imageUrl || "";

  return (
    <Link href={`/token/${token.mintAddress}`} style={{ textDecoration: "none" }}>
      <div className="token-card">

        {/* Banner / fundo */}
        <div className="token-banner">
          {bgImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bgImage} alt={token.name} className="token-banner-img" />
          ) : (
            <div className="token-banner-placeholder">
              <span className="token-symbol-ghost">${token.symbol}</span>
            </div>
          )}
          <div className="token-overlay" />

          {/* Badges */}
          <div className="token-badges">
            {token.isTrending && (
              <span className="token-badge-fire">🔥 Hot</span>
            )}
            {token.isNew && (
              <span className="token-badge-new">✨ New</span>
            )}
            {token.rank && (
              <span className="token-badge-rank">#{token.rank}</span>
            )}
          </div>

          {/* Market cap no rodapé do banner */}
          {stats && (
            <div className="token-banner-footer">
              <span className="token-mcap">{formatUsd(stats.marketCap, true)}</span>
              <PriceChange value={stats.priceChange24h} size="sm" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="token-info">
          <div className="token-avatar">
            {token.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={token.imageUrl} alt={token.symbol} className="token-avatar-img" />
            ) : (
              <div className="token-avatar-fallback">{token.symbol.slice(0, 2)}</div>
            )}
          </div>
          <div className="token-meta">
            <p className="token-name">{token.name} <span className="token-ticker">${token.symbol}</span></p>
            <p className="token-addr">{shortenAddress(token.mintAddress)}</p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="token-stats">
            <div className="token-stat">
              <span className="token-stat-label">Liquidez</span>
              <span className="token-stat-value">{formatUsd(stats.liquidity, true)}</span>
            </div>
            <div className="token-stat">
              <span className="token-stat-label">Vol 24h</span>
              <span className="token-stat-value">{formatUsd(stats.volume24h, true)}</span>
            </div>
            <div className="token-stat">
              <span className="token-stat-label">Holders</span>
              <span className="token-stat-value">{formatCompact(stats.holders)}</span>
            </div>
          </div>
        )}

        <style>{`
          .token-card {
            border-radius: 14px;
            overflow: hidden;
            background: #0d0d1a;
            border: 1px solid rgba(255,255,255,0.06);
            transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
            cursor: pointer;
            height: 100%;
          }
          .token-card:hover {
            transform: translateY(-4px);
            border-color: rgba(251,191,36,0.3);
            box-shadow: 0 10px 36px rgba(0,0,0,0.5);
          }
          .token-banner {
            position: relative;
            width: 100%; height: 140px;
            overflow: hidden; background: #13132a;
          }
          .token-banner-img {
            width: 100%; height: 100%;
            object-fit: cover;
            transition: transform 0.35s ease;
          }
          .token-card:hover .token-banner-img { transform: scale(1.06); }
          .token-banner-placeholder {
            width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #13132a 0%, #1c1c38 100%);
          }
          .token-symbol-ghost {
            font-size: 2.5rem; font-weight: 800;
            color: rgba(251,191,36,0.1); letter-spacing: -0.04em;
          }
          .token-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(to bottom, transparent 30%, rgba(8,8,15,0.9) 100%);
          }
          .token-badges {
            position: absolute; top: 0.5rem; left: 0.5rem;
            display: flex; gap: 0.3rem; flex-wrap: wrap;
          }
          .token-badge-fire, .token-badge-new, .token-badge-rank {
            font-size: 0.65rem; font-weight: 700;
            background: rgba(8,8,15,0.72);
            backdrop-filter: blur(4px);
            border-radius: 999px; padding: 0.2rem 0.5rem;
          }
          .token-badge-fire { color: #fb923c; border: 1px solid rgba(251,146,60,0.3); }
          .token-badge-new  { color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); }
          .token-badge-rank { color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
          .token-banner-footer {
            position: absolute; bottom: 0.6rem; left: 0.6rem; right: 0.6rem;
            display: flex; align-items: flex-end; justify-content: space-between;
          }
          .token-mcap {
            font-size: 1rem; font-weight: 800; color: #f9fafb;
            text-shadow: 0 1px 8px rgba(0,0,0,0.9);
          }
          .token-info {
            display: flex; align-items: center;
            gap: 0.6rem; padding: 0.65rem 0.75rem 0.4rem;
          }
          .token-avatar {
            flex-shrink: 0; width: 2rem; height: 2rem;
            border-radius: 50%; overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.1);
          }
          .token-avatar-img { width: 100%; height: 100%; object-fit: cover; }
          .token-avatar-fallback {
            width: 100%; height: 100%;
            background: linear-gradient(135deg, #1c1c38, #2d2d5a);
            display: flex; align-items: center; justify-content: center;
            font-size: 0.65rem; font-weight: 700; color: #fbbf24;
          }
          .token-meta { min-width: 0; flex: 1; }
          .token-name {
            font-size: 0.8125rem; font-weight: 700; color: #f9fafb;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            margin: 0;
          }
          .token-ticker { color: #fbbf24; font-size: 0.7rem; font-weight: 600; margin-left: 0.2rem; }
          .token-addr { font-size: 0.65rem; color: #4b5563; font-family: monospace; margin: 0.1rem 0 0; }
          .token-stats {
            display: grid; grid-template-columns: repeat(3, 1fr);
            gap: 0; border-top: 1px solid rgba(255,255,255,0.05);
            padding: 0.5rem 0.75rem 0.65rem;
          }
          .token-stat { display: flex; flex-direction: column; gap: 0.1rem; }
          .token-stat-label { font-size: 0.6rem; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; }
          .token-stat-value { font-size: 0.75rem; font-weight: 600; color: #d1d5db; }
        `}</style>
      </div>
    </Link>
  );
}

export function TokenCardSkeleton() {
  return (
    <div style={{
      borderRadius: "14px", overflow: "hidden",
      background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.06)"
    }}>
      <div style={{ height: "140px", background: "linear-gradient(90deg, #0d0d1a 25%, #1c1c38 50%, #0d0d1a 75%)", backgroundSize: "200% 100%", animation: "pulse 1.5s infinite" }} />
      <div style={{ padding: "0.65rem 0.75rem", display: "flex", gap: "0.6rem", alignItems: "center" }}>
        <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "#1c1c38" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <div style={{ height: "0.75rem", width: "60%", borderRadius: "4px", background: "#1c1c38" }} />
          <div style={{ height: "0.6rem", width: "40%", borderRadius: "4px", background: "#1c1c38" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", padding: "0.5rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.05)", gap: "0" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <div style={{ height: "0.5rem", width: "70%", borderRadius: "3px", background: "#1c1c38" }} />
            <div style={{ height: "0.65rem", width: "80%", borderRadius: "3px", background: "#1c1c38" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
