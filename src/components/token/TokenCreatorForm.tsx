"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload, AlertTriangle, CheckCircle, Zap, ExternalLink,
  Loader2, Share2, MessageCircle, Globe, Users, Image as ImageIcon,
  Info, X,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { InitialBuyPanel } from "./InitialBuyPanel";
import { LaunchCostSummary } from "./LaunchCostSummary";
import { TokenPreview } from "./TokenPreview";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { useSolBalance } from "@/hooks/useSolBalance";
import { useTokenCreation } from "@/hooks/useTokenCreation";
import { TOKEN_CREATION_FEE_SOL, totalLaunchCostSol } from "@/config/solana";
import { formatCompact } from "@/utils/format";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TokenCreateInput } from "@/types/token";

const DEFAULTS: TokenCreateInput = {
  name:          "",
  symbol:        "",
  description:   "",
  image:         null,
  banner:        null,
  decimals:      6,
  initialSupply: 1_000_000_000,
  initialBuySol: 0,
  social: { twitter: "", telegram: "", website: "", discord: "" },
};

const CREATION_STEP_KEYS = [
  "uploading_image",
  "uploading_metadata",
  "creating_mint",
  "registering_metadata",
  "creating_pool",
  "saving_to_db",
] as const;

const DECIMALS_INFO = [
  {
    value: 0,
    title: "0 — Token inteiro (sem fração)",
    description: "O token só existe em números inteiros. Não dá para ter \"meio token\".",
    ideal: "NFTs, vouchers, bilhetes, itens de jogo.",
    examples: ["✅ 1 token, 100 tokens", "❌ 0.5 tokens, 1.5 tokens"],
  },
  {
    value: 6,
    title: "6 — Padrão Solana (como USDC)",
    description: "A menor parte é 0.000001. Igual ao USDC e à maioria dos tokens Solana.",
    ideal: "Meme coins, tokens de trading, stablecoins.",
    examples: ["✅ 1 token = 1.000.000 unidades internas", "✅ 0.000001 é a menor fração possível"],
    recommended: true,
  },
  {
    value: 9,
    title: "9 — Alta precisão (como SOL)",
    description: "A menor parte é 0.000000001. Igual ao SOL (1 SOL = 1 bilhão de lamports).",
    ideal: "Tokens com preço muito baixo onde precisão é importante.",
    examples: ["✅ 0.000000001 é a menor fração possível"],
  },
];

// ── Componente de popover de info ──────────────────────────────
function DecimalsInfoPopover({ decimals }: { decimals: number }) {
  const [open, setOpen] = useState(false);
  const info = DECIMALS_INFO.find(d => d.value === decimals);

  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:bg-[var(--gold-dim)] transition-colors cursor-pointer"
      >
        <Info className="h-3 w-3" />
      </button>

      {open && info && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-6 z-50 w-72 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-2)] shadow-2xl shadow-black/60 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-[var(--text-primary)]">{info.title}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{info.description}</p>
            <div className="rounded-lg bg-[var(--surface-3)] p-2.5 space-y-1">
              {info.examples.map((ex, i) => (
                <p key={i} className="text-xs font-mono text-[var(--text-secondary)]">{ex}</p>
              ))}
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Ideal para</p>
              <p className="text-xs text-[var(--text-secondary)]">{info.ideal}</p>
            </div>
            {info.recommended && (
              <div className="flex items-center gap-1.5 rounded-lg bg-[var(--gold-dim)] border border-[var(--gold)]/20 px-2.5 py-1.5">
                <span className="text-[var(--gold)] text-xs font-bold">⭐ Recomendado para meme coins</span>
              </div>
            )}
          </div>
        </>
      )}
    </span>
  );
}

export function TokenCreatorForm() {
  const { connected } = useWallet();
  const { balance } = useSolBalance();
  const { t } = useLanguage();
  const { create, reset, step, stepLabel, loading, error, result } = useTokenCreation();

  const [form, setForm]               = useState<TokenCreateInput>(DEFAULTS);
  const [imagePreview, setImagePreview]   = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const imageRef  = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const totalCost   = totalLaunchCostSol(form.initialBuySol);
  const hasEnoughSol = balance !== null && balance >= totalCost + 0.01;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "banner") => {
    const file = e.target.files?.[0] ?? null;
    if (type === "image") {
      setForm(f => ({ ...f, image: file }));
      if (file) { const r = new FileReader(); r.onload = ev => setImagePreview(ev.target?.result as string); r.readAsDataURL(file); }
      else setImagePreview(null);
    } else {
      setForm(f => ({ ...f, banner: file }));
      if (file) { const r = new FileReader(); r.onload = ev => setBannerPreview(ev.target?.result as string); r.readAsDataURL(file); }
      else setBannerPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) return;
    await create(form);
  };

  // ── Sucesso ──────────────────────────────────────────────────
  if (result) {
    const tokensFromBuy = Math.floor(form.initialBuySol * 100_000_000);
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardBody className="text-center space-y-5 py-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--positive)]/10 mx-auto">
              <CheckCircle className="h-8 w-8 text-[var(--positive)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{t.create.success}</h2>
              {form.initialBuySol > 0 && (
                <p className="text-sm text-[var(--positive)] mt-1">
                  {t.create.successBought
                    .replace("{amount}", formatCompact(tokensFromBuy))
                    .replace("{symbol}", form.symbol)}
                </p>
              )}
            </div>
            <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-4 text-left space-y-3">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Mint Address</p>
                <p className="text-xs font-mono text-[var(--gold)] break-all">{result.mintAddress}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{t.common.solscan}</p>
                <a href={`https://solscan.io/tx/${result.mintSignature}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono text-[var(--gold)] break-all hover:underline inline-flex items-center gap-1">
                  {result.mintSignature.slice(0, 20)}... <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`/token/${result.mintAddress}`}
                className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#08080f] font-bold text-sm">
                {t.create.viewMarketplace}
              </Link>
              <Button variant="outline" className="w-full"
                onClick={() => { reset(); setForm(DEFAULTS); setImagePreview(null); setBannerPreview(null); }}>
                {t.create.createAnother}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────
  const stepLabels: Record<string, string> = {
    uploading_image:      t.create.uploading,
    uploading_metadata:   t.create.metadata,
    creating_mint:        t.create.mintingSolana,
    registering_metadata: t.create.onChainMeta,
    creating_pool:        t.create.creatingPool,
    saving_to_db:         t.create.savingDb,
  };

  if (loading) {
    const currentIdx = CREATION_STEP_KEYS.findIndex(k => k === step);
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardBody className="py-10 space-y-6">
            <div className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold-dim)] mx-auto mb-3">
                <Loader2 className="h-7 w-7 text-[var(--gold)] animate-spin" />
              </div>
              <p className="text-base font-bold text-[var(--text-primary)]">{stepLabels[step] ?? stepLabel}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{t.create.dontClose}</p>
            </div>
            <div className="space-y-2">
              {CREATION_STEP_KEYS.map((key, i) => {
                const isDone   = i < currentIdx;
                const isActive = i === currentIdx;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className={[
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isDone   ? "bg-[var(--positive)] text-white" : "",
                      isActive ? "bg-[var(--gold)] text-[#08080f] animate-pulse" : "",
                      !isDone && !isActive ? "bg-[var(--surface-3)] text-[var(--text-muted)]" : "",
                    ].join(" ")}>{isDone ? "✓" : i + 1}</div>
                    <p className={[
                      "text-sm",
                      isDone   ? "text-[var(--positive)]" : "",
                      isActive ? "text-[var(--gold)] font-semibold" : "",
                      !isDone && !isActive ? "text-[var(--text-muted)]" : "",
                    ].join(" ")}>{stepLabels[key] ?? key}</p>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ── Erro ─────────────────────────────────────────────────────
  if (step === "error") {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="border-[#ef4444]/30">
          <CardBody className="text-center py-8 space-y-4">
            <AlertTriangle className="h-10 w-10 text-[#ef4444] mx-auto" />
            <div>
              <p className="text-base font-bold text-[var(--text-primary)]">{t.create.failed}</p>
              <p className="text-sm text-[#ef4444] mt-1 break-words">{error}</p>
            </div>
            <Button variant="outline" onClick={reset} className="w-full">{t.create.tryAgain}</Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ── Formulário principal ─────────────────────────────────────
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 max-w-5xl mx-auto">
        <div className="space-y-5">
          {!connected && (
            <div className="flex items-start gap-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-dim)] p-4">
              <AlertTriangle className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[var(--gold)]">{t.create.walletRequired}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t.create.walletRequiredDesc}</p>
              </div>
            </div>
          )}

          {/* ── Imagem + Banner ── */}
          <Card>
            <CardHeader><CardTitle>{t.create.mediaSection}</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t.create.logoLabel} <span className="text-[var(--negative)] text-xs">*</span></p>
                <div onClick={() => imageRef.current?.click()}
                  className="flex items-center gap-4 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] p-4 cursor-pointer hover:border-[var(--border-strong)] transition-colors">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="logo" className="h-16 w-16 rounded-xl object-cover border border-[var(--border)] shrink-0" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--gold-dim)] shrink-0">
                      <Upload className="h-6 w-6 text-[var(--gold)]" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{imagePreview ? t.create.clickToChange : t.create.clickToUpload}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.create.logoHint}</p>
                  </div>
                  <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageChange(e, "image")} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  {t.create.bannerLabel} <span className="text-xs text-[var(--text-muted)]">({t.create.optional})</span>
                </p>
                <div onClick={() => bannerRef.current?.click()}
                  className="relative flex items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] overflow-hidden cursor-pointer hover:border-[var(--border-strong)] transition-colors h-24">
                  {bannerPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[var(--text-muted)]">
                      <ImageIcon className="h-6 w-6" />
                      <span className="text-xs">{t.create.bannerHint}</span>
                    </div>
                  )}
                  <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageChange(e, "banner")} />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* ── Informações ── */}
          <Card>
            <CardHeader><CardTitle>{t.create.infoSection}</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <Input label={t.create.nameLabel} placeholder={t.create.namePlaceholder} maxLength={32}
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                hint={t.create.nameHint} required />
              <Input label={t.create.tickerLabel} placeholder={t.create.tickerPlaceholder} maxLength={10}
                value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))}
                hint={t.create.tickerHint} required />
              <Textarea label={t.create.descLabel} placeholder={t.create.descPlaceholder}
                maxLength={280} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                hint={`${form.description.length}/280`} />
            </CardBody>
          </Card>

          {/* ── Links Sociais ── */}
          <Card>
            <CardHeader><CardTitle>{t.create.socialSection} <span className="text-xs font-normal text-[var(--text-muted)]">({t.create.optional})</span></CardTitle></CardHeader>
            <CardBody className="space-y-3">
              <Input label="Share2 / X" placeholder="https://x.com/seutoken" value={form.social.twitter ?? ""}
                onChange={e => setForm(f => ({ ...f, social: { ...f.social, twitter: e.target.value } }))}
                leftAdornment={<Share2 className="h-4 w-4" />} />
              <Input label="Telegram" placeholder="https://t.me/seutoken" value={form.social.telegram ?? ""}
                onChange={e => setForm(f => ({ ...f, social: { ...f.social, telegram: e.target.value } }))}
                leftAdornment={<MessageCircle className="h-4 w-4" />} />
              <Input label="Website" placeholder="https://seutoken.com" value={form.social.website ?? ""}
                onChange={e => setForm(f => ({ ...f, social: { ...f.social, website: e.target.value } }))}
                leftAdornment={<Globe className="h-4 w-4" />} />
              <Input label="Discord" placeholder="https://discord.gg/seutoken" value={form.social.discord ?? ""}
                onChange={e => setForm(f => ({ ...f, social: { ...f.social, discord: e.target.value } }))}
                leftAdornment={<Users className="h-4 w-4" />} />
            </CardBody>
          </Card>

          {/* ── Parâmetros técnicos ── */}
          <Card>
            <CardHeader><CardTitle>{t.create.paramsSection}</CardTitle></CardHeader>
            <CardBody className="space-y-4">

              {/* Decimais com ícone de info */}
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 flex items-center">
                  {t.create.decimalsLabel}
                  <span className="ml-2 text-xs text-[var(--text-muted)] font-normal">
                    — {t.create.decimalsHint}
                  </span>
                  <DecimalsInfoPopover decimals={form.decimals} />
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 0, label: "0", hint: t.create.integerToken },
                    { value: 6, label: "6", hint: t.create.solanaDefault },
                    { value: 9, label: "9", hint: t.create.highPrecision },
                  ].map(({ value, label, hint }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, decimals: value }))}
                      className={cn(
                        "flex flex-col items-center rounded-xl py-2.5 px-2 border transition-all cursor-pointer",
                        form.decimals === value
                          ? "border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]"
                          : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <span className="text-lg font-extrabold">{label}</span>
                      <span className="text-[10px] text-center leading-tight mt-0.5 opacity-70">{hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Supply total */}
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  {t.create.supplyLabel}
                  <span className="ml-2 text-xs text-[var(--text-muted)] font-normal">
                    — {t.create.supplyHint}
                  </span>
                </p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { value: 1_000_000,         label: "1M" },
                    { value: 1_000_000_000,     label: "1B" },
                    { value: 1_000_000_000_000, label: "1T" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, initialSupply: value }))}
                      className={cn(
                        "rounded-xl py-2 border text-sm font-bold transition-all cursor-pointer",
                        form.initialSupply === value
                          ? "border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]"
                          : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder={t.create.customValue}
                  type="number"
                  min={1}
                  value={form.initialSupply === 1_000_000 || form.initialSupply === 1_000_000_000 || form.initialSupply === 1_000_000_000_000
                    ? ""
                    : String(form.initialSupply)
                  }
                  onChange={e => {
                    const v = parseInt(e.target.value);
                    if (v > 0) setForm(f => ({ ...f, initialSupply: v }));
                  }}
                  hint={`${t.create.currentSupply} ${formatCompact(form.initialSupply)}`}
                />
              </div>
            </CardBody>
          </Card>

          <InitialBuyPanel
            value={form.initialBuySol}
            onChange={sol => setForm(f => ({ ...f, initialBuySol: sol }))}
            symbol={form.symbol || "TOKEN"}
            supply={form.initialSupply}
          />

          <LaunchCostSummary
            initialBuySol={form.initialBuySol}
            symbol={form.symbol || "TOKEN"}
            walletBalance={balance}
          />

          {!connected ? (
            <ConnectWalletButton size="xl" className="w-full" />
          ) : (
            <Button type="submit" size="xl" className="w-full"
              loading={loading} leftIcon={<Zap className="h-5 w-5" />}
              disabled={!hasEnoughSol}>
              {form.initialBuySol > 0
                ? t.create.createWithBuy.replace("{symbol}", form.symbol || "Token").replace("{sol}", String(form.initialBuySol))
                : t.create.createButton.replace("{symbol}", form.symbol || "Token")}
            </Button>
          )}

          <p className="text-center text-xs text-[var(--text-muted)]">
            {t.create.immutableNote}
          </p>
        </div>

        <div className="hidden lg:block">
          <TokenPreview
            form={form}
            imagePreview={imagePreview}
            bannerPreview={bannerPreview}
          />
        </div>
      </div>

      <div className="lg:hidden mt-6 max-w-xl mx-auto">
        <TokenPreview
          form={form}
          imagePreview={imagePreview}
          bannerPreview={bannerPreview}
        />
      </div>
    </form>
  );
}
