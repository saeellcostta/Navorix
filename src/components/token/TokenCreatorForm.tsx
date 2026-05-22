"use client";

import React, { useState, useRef } from "react";
import { Upload, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { InitialBuyPanel } from "./InitialBuyPanel";
import { LaunchCostSummary } from "./LaunchCostSummary";
import { useSolBalance } from "@/hooks/useSolBalance";
import { TOKEN_CREATION_FEE_SOL, totalLaunchCostSol } from "@/config/solana";
import { formatCompact } from "@/utils/format";
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

export function TokenCreatorForm() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { balance } = useSolBalance();

  const [form, setForm] = useState<TokenCreateInput>(DEFAULTS);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ mintAddress: string; signature: string } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const totalCost = totalLaunchCostSol(form.initialBuySol);
  const hasEnoughSol = balance !== null && balance >= totalCost + 0.005;

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

    if (!connected) {
      setVisible(true);
      return;
    }

    if (!form.name.trim()) { toast.error("Nome do token é obrigatório"); return; }
    if (!form.symbol.trim()) { toast.error("Ticker é obrigatório"); return; }
    if (!/^[A-Z0-9]{1,10}$/.test(form.symbol.toUpperCase())) {
      toast.error("Ticker: somente letras maiúsculas e números (máx. 10)");
      return;
    }
    if (!hasEnoughSol) {
      toast.error(
        `Saldo insuficiente. Você precisa de ~${(totalCost + 0.005).toFixed(4)} SOL`
      );
      return;
    }

    setLoading(true);
    try {
      // TODO: call createSplToken(connection, wallet, form)
      // The function in src/services/solana/tokenService.ts handles:
      //   1. Transfer TOKEN_CREATION_FEE_SOL → FEE_WALLET
      //   2. Transfer form.initialBuySol    → FEE_WALLET (initial buy SOL)
      //   3. createMint()
      //   4. mintTo() with solToTokensAtLaunch(form.initialBuySol) to creator
      toast.info("Wire up createSplToken() em src/services/solana/tokenService.ts");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha na criação do token");
    } finally {
      setLoading(false);
    }
  };

  /* ── Success state ── */
  if (result) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardBody className="text-center space-y-4 py-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--positive)]/10 mx-auto">
            <CheckCircle className="h-8 w-8 text-[var(--positive)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Token Criado!</h2>
          {form.initialBuySol > 0 && (
            <p className="text-sm text-[var(--positive)]">
              Você comprou{" "}
              <span className="font-bold">
                {formatCompact(Math.floor(form.initialBuySol * 100_000_000))} ${form.symbol}
              </span>{" "}
              na compra inicial.
            </p>
          )}
          <div className="rounded-lg bg-[var(--surface-2)] p-3 text-left space-y-2">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Mint Address</p>
              <p className="text-sm font-mono text-[var(--gold)] break-all">{result.mintAddress}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Transação</p>
              <a
                href={`https://solscan.io/tx/${result.signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[var(--gold)] break-all hover:underline"
              >
                {result.signature}
              </a>
            </div>
          </div>
          <Button onClick={() => { setResult(null); setForm(DEFAULTS); setImagePreview(null); }} variant="outline" className="w-full">
            Criar outro token
          </Button>
        </CardBody>
      </Card>
    );
  }

  /* ── Main form ── */
  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
      {/* Wallet not connected */}
      {!connected && (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-dim)] p-4">
          <AlertTriangle className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--gold)]">Conecte sua carteira</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Phantom, Solflare ou Backpack necessário para criar tokens.
            </p>
          </div>
        </div>
      )}

      {/* ── Seção 1: Informações do Token ── */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Token</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          {/* Image upload */}
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Imagem / Logo
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative flex items-center gap-4 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] p-4 cursor-pointer hover:border-[var(--border-strong)] transition-colors"
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-16 w-16 rounded-xl object-cover border border-[var(--border)] shrink-0"
                />
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
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
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

      {/* ── Seção 2: Parâmetros Técnicos ── */}
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros do Token</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Decimais"
            type="number"
            min={0}
            max={9}
            value={form.decimals}
            onChange={(e) => setForm((f) => ({ ...f, decimals: parseInt(e.target.value) || 6 }))}
            hint="Padrão: 6 (como USDC na Solana)"
          />
          <Input
            label="Supply total inicial"
            type="number"
            min={1}
            value={form.initialSupply}
            onChange={(e) =>
              setForm((f) => ({ ...f, initialSupply: parseInt(e.target.value) || 1_000_000_000 }))
            }
            hint="Quantidade total de tokens a mintar"
          />
        </CardBody>
      </Card>

      {/* ── Seção 3: Compra Inicial (Pump.fun style) ── */}
      <InitialBuyPanel
        value={form.initialBuySol}
        onChange={(sol) => setForm((f) => ({ ...f, initialBuySol: sol }))}
        symbol={form.symbol || "TOKEN"}
      />

      {/* ── Seção 4: Resumo de custo ── */}
      <LaunchCostSummary
        initialBuySol={form.initialBuySol}
        symbol={form.symbol || "TOKEN"}
        walletBalance={balance}
      />

      {/* ── CTA ── */}
      <Button
        type="submit"
        size="xl"
        className="w-full"
        loading={loading}
        leftIcon={<Zap className="h-5 w-5" />}
        disabled={connected && !hasEnoughSol}
      >
        {!connected
          ? "Conectar Carteira"
          : form.initialBuySol > 0
            ? `Criar ${form.symbol || "Token"} · Comprar ${form.initialBuySol} SOL`
            : `Criar ${form.symbol || "Token"} na Solana`}
      </Button>

      <p className="text-center text-xs text-[var(--text-muted)]">
        Todos os dados são imutáveis após a criação · Taxa de {TOKEN_CREATION_FEE_SOL} SOL
      </p>
    </form>
  );
}
