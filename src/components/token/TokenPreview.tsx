"use client";

import React from "react";
import { Globe, MessageCircle, Users, Zap, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCompact } from "@/utils/format";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TokenCreateInput } from "@/types/token";

interface TokenPreviewProps {
  form: TokenCreateInput;
  imagePreview: string | null;
  bannerPreview: string | null;
}

export function TokenPreview({ form, imagePreview, bannerPreview }: TokenPreviewProps) {
  const { t, lang } = useLanguage();

  const previewLabel: Record<string, string> = {
    "pt-BR": "Pré-visualização em tempo real",
    en:      "Real-time Preview",
    es:      "Vista previa en tiempo real",
    zh:      "实时预览",
    ja:      "リアルタイムプレビュー",
    ko:      "실시간 미리보기",
    ru:      "Предварительный просмотр",
    de:      "Echtzeit-Vorschau",
    fr:      "Aperçu en temps réel",
    tr:      "Gerçek Zamanlı Önizleme",
  };
  const hasName   = form.name.trim().length > 0;
  const hasSymbol = form.symbol.trim().length > 0;
  const hasSocial = form.social.twitter || form.social.telegram || form.social.website || form.social.discord;
  const supply    = form.initialSupply || 1_000_000_000;

  return (
    <div className="sticky top-24 space-y-3">
      {/* Label */}
      <div className="flex items-center gap-2 mb-1">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--positive)] animate-pulse" />
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {previewLabel[lang] ?? "Real-time Preview"}
        </p>
      </div>

      {/* Card do token */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden">

        {/* ── Banner + Logo sobrepostos ── */}
        <div className="relative">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-br from-[var(--surface-3)] to-[var(--surface-2)] overflow-hidden">
            {bannerPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-10">
                <Zap className="h-14 w-14 text-[var(--gold)]" fill="currentColor" />
              </div>
            )}
            {/* gradiente de baixo para cima */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--surface-1)] to-transparent" />
          </div>

          {/* Logo — posicionado sobre o banner, canto inferior esquerdo */}
          <div className="absolute bottom-0 left-4 translate-y-1/2">
            <div className={cn(
              "h-14 w-14 rounded-2xl overflow-hidden shrink-0",
              "border-[3px] border-[var(--surface-1)]",
              "bg-[var(--surface-3)] shadow-xl"
            )}>
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl font-black text-[var(--gold)]">
                    {hasSymbol ? form.symbol.charAt(0) : "?"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo — espaço para o logo que está sobreposto */}
        <div className="px-4 pt-10 pb-4">
          {/* Nome + Ticker */}
          <div className="mb-2">
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

          {/* Descrição */}
          {form.description ? (
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-3">
              {form.description}
            </p>
          ) : (
            <p className="text-xs text-[var(--text-muted)] italic mb-3">{t.create.descPlaceholder}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-[var(--surface-2)] p-2.5 mb-3">
            {[
              { label: "Market Cap",   value: "$0" },
              { label: "Liquidez",     value: form.initialBuySol > 0 ? `${form.initialBuySol} SOL` : "$0" },
              { label: "Supply Total", value: formatCompact(supply) + ` ${hasSymbol ? "$" + form.symbol : "tokens"}` },
              { label: "Portadores",   value: "1" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider leading-tight">{label}</p>
                <p className="text-xs font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
              </div>
            ))}
          </div>

          {/* Links sociais */}
          {hasSocial && (
            <div className="flex items-center gap-1.5 flex-wrap">
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
          {t.create.paramsSection}
        </p>
        {[
          { label: t.create.nameLabel,    done: hasName },
          { label: t.create.tickerLabel,  done: hasSymbol },
          { label: t.create.logoLabel,    done: !!imagePreview },
          { label: t.create.descLabel,    done: form.description.length > 10 },
          { label: t.create.bannerLabel,  done: !!bannerPreview },
          { label: t.create.socialSection,done: !!hasSocial },
          { label: t.create.initialBuy,   done: form.initialBuySol > 0 },
        ].map(({ label, done }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
              done ? "bg-[var(--positive)] text-white" : "bg-[var(--surface-3)] text-[var(--text-muted)]"
            )}>{done ? "✓" : "·"}</div>
            <span className={cn("text-xs", done ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]")}>
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
                  className={cn("h-full rounded-full transition-all duration-300",
                    pct === 100 ? "bg-[var(--positive)]" : "bg-gradient-to-r from-[#fbbf24] to-[#d97706]"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })()}
      </div>

      <p className="text-[10px] text-[var(--text-muted)] text-center">{t.create.immutableNote}</p>
    </div>
  );
}
