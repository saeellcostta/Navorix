"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Upload, AlertTriangle, CheckCircle, Zap, ExternalLink, Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { InitialBuyPanel } from "./InitialBuyPanel";
import { LaunchCostSummary } from "./LaunchCostSummary";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { useSolBalance } from "@/hooks/useSolBalance";
import { useTokenCreation } from "@/hooks/useTokenCreation";
import { TOKEN_CREATION_FEE_SOL, totalLaunchCostSol } from "@/config/solana";
import { formatCompact, shortenAddress } from "@/utils/format";
import type { TokenCreateInput } from "@/types/token";

const DEFAULTS: TokenCreateInput = {
  name: "",
  symbol: "",
  description: "",
  image: null,
  decimals: 6,
  initialSupply: 1_000_000_000,
  initialBuySol: 0,
};

// Progress step indicator
const STEPS = [
  { key: "uploading_image",      label: "Imagem" },
  { key: "uploading_metadata",   label: "Metadados" },
  { key: "creating_mint",        label: "Mint Solana" },
  { key: "registering_metadata", label: "Metadados on-chain" },
  { key: "creating_pool",        label: "Pool Raydium" },
  { key: "saving_to_db",         label: "Marketplace" },
] as const;

export function TokenCreatorForm() {
  const { connected } = useWallet();
  const { balance } = useSolBalance();
  const { create, reset, step, stepLabel, loading, error, result } = useTokenCreation();

  const [form, setForm] = useState<TokenCreateInput>(DEFAULTS);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalCost = totalLaunchCostSol(form.initialBuySol);
  const hasEnoughSol = balance !== null && balance >= totalCost + 0.01;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({ ...f, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) return;
    await create(form);
  };

  // ── Success screen ──────────────────────────────────────────────
  if (result) {
    const tokensFromBuy = Math.floor(form.initialBuySol * 100_000_000);
    return (
      <Card className="max-w-lg mx-auto">
        <CardBody className="text-center space-y-5 py-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--positive)]/10 mx-auto">
            <CheckCircle className="h-8 w-8 text-[var(--positive)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Token Criado! 🎉</h2>
            {form.initialBuySol > 0 && (
              <p className="text-sm text-[var(--positive)] mt-1">
                Você comprou{" "}
                <span className="font-bold">{formatCompact(tokensFromBuy)} ${form.symbol}</span>{" "}
                na compra inicial.
              </p>
            )}
          </div>

          <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-4 text-left space-y-3">
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Mint Address</p>
              <p className="text-xs font-mono text-[var(--gold)] break-all">{result.mintAddress}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Transação</p>
              <a
                href={`https://solscan.io/tx/${result.mintSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[var(--gold)] break-all hover:underline inline-flex items-center gap-1"
              >
                {result.mintSignature.slice(0, 20)}...
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href={`/token/${result.mintAddress}`}
              className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#08080f] font-bold text-sm"
            >
              Ver token no marketplace
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { reset(); setForm(DEFAULTS); setImagePreview(null); }}
            >
              Criar outro token
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  // ── Loading screen ──────────────────────────────────────────────
  if (loading) {
    const currentIdx = STEPS.findIndex((s) => s.key === step);
    return (
      <Card className="max-w-lg mx-auto">
        <CardBody className="py-10 space-y-6">
          <div className="text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold-dim)] mx-auto mb-3">
              <Loader2 className="h-7 w-7 text-[var(--gold)] animate-spin" />
            </div>
            <p className="text-base font-bold text-[var(--text-primary)]">{stepLabel}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Não feche esta janela</p>
          </div>

          {/* Step progress */}
          <div className="space-y-2">
            {STEPS.map((s, i) => {
              const isDone    = i < currentIdx;
              const isActive  = i === currentIdx;
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <div className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isDone   ? "bg-[var(--positive)] text-white" : "",
                    isActive ? "bg-[var(--gold)] text-[#08080f] animate-pulse" : "",
                    !isDone && !isActive ? "bg-[var(--surface-3)] text-[var(--text-muted)]" : "",
                  ].join(" ")}>
                    {isDone ? "✓" : i + 1}
                  </div>
                  <p className={[
                    "text-sm",
                    isDone   ? "text-[var(--positive)]" : "",
                    isActive ? "text-[var(--gold)] font-semibold" : "",
                    !isDone && !isActive ? "text-[var(--text-muted)]" : "",
                  ].join(" ")}>
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    );
  }

  // ── Error screen ────────────────────────────────────────────────
  if (step === "error") {
    return (
      <Card className="max-w-lg mx-auto border-[#ef4444]/30">
        <CardBody className="text-center py-8 space-y-4">
          <AlertTriangle className="h-10 w-10 text-[#ef4444] mx-auto" />
          <div>
            <p className="text-base font-bold text-[var(--text-primary)]">Falha na criação</p>
            <p className="text-sm text-[#ef4444] mt-1 break-words">{error}</p>
          </div>
          <Button
            variant="outline"
            onClick={reset}
            className="w-full"
          >
            Tentar novamente
          </Button>
        </CardBody>
      </Card>
    );
  }

  // ── Main form ────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
      {!connected && (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-dim)] p-4">
          <AlertTriangle className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--gold)]">Conecte sua carteira</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Phantom, Solflare ou Backpack necessário.
            </p>
          </div>
        </div>
      )}

      {/* Informações do Token */}
      <Card>
        <CardHeader><CardTitle>Informações do Token</CardTitle></CardHeader>
        <CardBody className="space-y-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-1.5">Imagem / Logo</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative flex items-center gap-4 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] p-4 cursor-pointer hover:border-[var(--border-strong)] transition-colors"
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="preview" className="h-16 w-16 rounded-xl object-cover border border-[var(--border)] shrink-0" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--gold-dim)] shrink-0">
                  <Upload className="h-6 w-6 text-[var(--gold)]" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {imagePreview ? "Clique para trocar" : "Clique para enviar"}
                </p>
                <p className="text-xs text-[var(--text-muted)]">PNG, JPG, GIF até 5MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>

          <Input
            label="Nome do Token"
            placeholder="ex: Navorix Coin"
            maxLength={32}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            hint="Máximo 32 caracteres"
            required
          />

          <Input
            label="Ticker / Símbolo"
            placeholder="ex: NVR"
            maxLength={10}
            value={form.symbol}
            onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value.toUpperCase() }))}
            hint="Somente maiúsculas e números (máx. 10)"
            required
          />

          <Textarea
            label="Descrição"
            placeholder="Descreva seu token..."
            maxLength={280}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            hint={`${form.description.length}/280`}
          />
        </CardBody>
      </Card>

      {/* Parâmetros técnicos */}
      <Card>
        <CardHeader><CardTitle>Parâmetros do Token</CardTitle></CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Decimais"
            type="number"
            min={0}
            max={9}
            value={form.decimals}
            onChange={(e) => setForm((f) => ({ ...f, decimals: parseInt(e.target.value) || 6 }))}
            hint="Padrão: 6"
          />
          <Input
            label="Supply total"
            type="number"
            min={1}
            value={form.initialSupply}
            onChange={(e) => setForm((f) => ({ ...f, initialSupply: parseInt(e.target.value) || 1_000_000_000 }))}
            hint="Quantidade total de tokens a mintar"
          />
        </CardBody>
      </Card>

      {/* Compra inicial */}
      <InitialBuyPanel
        value={form.initialBuySol}
        onChange={(sol) => setForm((f) => ({ ...f, initialBuySol: sol }))}
        symbol={form.symbol || "TOKEN"}
      />

      {/* Resumo de custo */}
      <LaunchCostSummary
        initialBuySol={form.initialBuySol}
        symbol={form.symbol || "TOKEN"}
        walletBalance={balance}
      />

      {/* CTA */}
      {!connected ? (
        <ConnectWalletButton size="xl" className="w-full" />
      ) : (
        <Button
          type="submit"
          size="xl"
          className="w-full"
          loading={loading}
          leftIcon={<Zap className="h-5 w-5" />}
          disabled={!hasEnoughSol}
        >
          {form.initialBuySol > 0
            ? `Criar ${form.symbol || "Token"} · Comprar ${form.initialBuySol} SOL`
            : `Criar ${form.symbol || "Token"} na Solana`}
        </Button>
      )}

      <p className="text-center text-xs text-[var(--text-muted)]">
        Dados imutáveis após criação · Taxa: {TOKEN_CREATION_FEE_SOL} SOL
      </p>
    </form>
  );
}
