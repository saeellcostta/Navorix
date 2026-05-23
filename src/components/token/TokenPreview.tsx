"use client";

import React from "react";
import { Globe, Share2, MessageCircle, Users, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TokenCreateInput } from "@/types/token";

interface TokenPreviewProps {
  form: TokenCreateInput;
  imagePreview: string | null;
  bannerPreview: string | null;
}

export function TokenPreview({ form, imagePreview, bannerPreview }: TokenPreviewProps) {
  const hasName    = form.name.trim().length > 0;
  const hasSymbol  = form.symbol.trim().length > 0;
  const hasSocial  = form.social.twitter || form.social.telegram || form.social.website || form.social.discord;

  return (
    <div className="sticky top-24 space-y-3">
      {/* Label */}
      <div className="flex items-center gap-2 mb-1">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--positive)] animate-pulse" />
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          Preview em tempo real
        </p>
      </div>

      {/* Card do token — igual ao marketplace */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden">
        {/* Banner */}
        <div className="relative h-24 bg-gradient-to-br from-[var(--surface-3)] to-[var(--surface-2)] overflow-hidden">
          {bannerPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bannerPreview}
              alt="banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="opacity-10">
                <Zap className="h-12 w-12 text-[var(--gold)]" fill="currentColor" />
              </div>
            </div>
          )}
          {/* Gradiente sobre o banner */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-1)] to-transparent" />
        </div>

        {/* Logo sobre o banner */}
        <div className="px-4 -mt-8 pb-4">
          <div className="flex items-end gap-3 mb-3">
            <div className={cn(
              "h-16 w-16 rounded-2xl border-2 border-[var(--surface-1)]",
              "overflow-hidden bg-[var(--surface-3)] shrink-0",
              "shadow-lg"
            )}>
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-black text-[var(--gold)]">
                    {hasSymbol ? form.symbol.charAt(0) : "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="pb-1 min-w-0">
              <h3 className={cn(
                "text-base font-extrabold leading-tight",
                hasName ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              )}>
                {hasName ? form.name : "Nome do Token"}
              </h3>
              <p className={cn(
                "text-sm font-mono",
                hasSymbol ? "text-[var(--gold)]" : "text-[var(--text-muted)]"
              )}>
                ${hasSymbol ? form.symbol : "TICKER"}
              </p>
            </div>
          </div>

          {/* Descrição */}
          {form.description ? (
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-3">
              {form.description}
            </p>
          ) : (
            <p className="text-xs text-[var(--text-muted)] italic mb-3">
              Adicione uma descrição...
            </p>
          )}

          {/* Stats (placeholders) */}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-[var(--surface-2)] p-2.5 mb-3">
            {[
              { label: "Market Cap", value: "$0" },
              { label: "Liquidez",   value: `${form.initialBuySol} SOL` },
              { label: "Volume 24h", value: "$0" },
              { label: "Holders",    value: "1" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
                <p className="text-xs font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
              </div>
            ))}
          </div>

          {/* Links sociais */}
          {hasSocial && (
            <div className="flex items-center gap-2 flex-wrap">
              {form.social.twitter && (
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] bg-[var(--surface-3)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                  <Share2 className="h-2.5 w-2.5" /> Twitter
                </span>
              )}
              {form.social.telegram && (
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] bg-[var(--surface-3)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                  <MessageCircle className="h-2.5 w-2.5" /> Telegram
                </span>
              )}
              {form.social.website && (
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] bg-[var(--surface-3)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                  <Globe className="h-2.5 w-2.5" /> Website
                </span>
              )}
              {form.social.discord && (
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] bg-[var(--surface-3)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                  <Users className="h-2.5 w-2.5" /> Discord
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Checklist de completude */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-4 space-y-2">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Completude do token
        </p>
        {[
          { label: "Nome",          done: hasName },
          { label: "Ticker",        done: hasSymbol },
          { label: "Imagem/Logo",   done: !!imagePreview },
          { label: "Descrição",     done: form.description.length > 10 },
          { label: "Banner",        done: !!bannerPreview },
          { label: "Links sociais", done: !!hasSocial },
          { label: "Compra inicial",done: form.initialBuySol > 0 },
        ].map(({ label, done }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
              done
                ? "bg-[var(--positive)] text-white"
                : "bg-[var(--surface-3)] text-[var(--text-muted)]"
            )}>
              {done ? "✓" : "·"}
            </div>
            <span className={cn(
              "text-xs",
              done ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
            )}>
              {label}
            </span>
          </div>
        ))}

        {/* Barra de progresso */}
        {(() => {
          const items = [hasName, hasSymbol, !!imagePreview, form.description.length > 10, !!bannerPreview, !!hasSocial, form.initialBuySol > 0];
          const pct = Math.round((items.filter(Boolean).length / items.length) * 100);
          return (
            <div className="mt-2 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1.5">
                <span>Perfil do token</span>
                <span className={pct === 100 ? "text-[var(--positive)]" : ""}>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    pct === 100
                      ? "bg-[var(--positive)]"
                      : "bg-gradient-to-r from-[#fbbf24] to-[#d97706]"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })()}
      </div>

      <p className="text-[10px] text-[var(--text-muted)] text-center px-2">
        Dados imutáveis após criação on-chain
      </p>
    </div>
  );
}
