"use client";

import React, { useState } from "react";
import { Coins, Zap, Info, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import {
  INITIAL_BUY_PRESETS_SOL,
  MAX_INITIAL_BUY_SOL,
  solToTokensAtLaunch,
  getTokensPerSol,
} from "@/config/solana";
import { formatCompact } from "@/utils/format";

interface InitialBuyPanelProps {
  value: number;
  onChange: (sol: number) => void;
  symbol: string;
  supply?: number;
}

/** Garante número finito — evita NaN/Infinity em cálculos */
function safe(n: number, fallback = 0): number {
  return isFinite(n) && !isNaN(n) ? n : fallback;
}

export function InitialBuyPanel({
  value,
  onChange,
  symbol,
  supply = 1_000_000_000,
}: InitialBuyPanelProps) {
  const safeSupply    = safe(supply, 1_000_000_000) || 1_000_000_000;
  const tokensPerSol  = getTokensPerSol(safeSupply);
  const tokensReceived = solToTokensAtLaunch(safe(value), safeSupply);
  const pctOfSupply   = safe((safe(value) * tokensPerSol) / safeSupply * 100);

  const [expanded, setExpanded]       = useState(false);
  const [customInput, setCustomInput] = useState("");

  const isActive = value > 0;

  const handlePreset = (sol: number) => {
    onChange(sol);
    setCustomInput("");
  };

  const handleCustomChange = (raw: string) => {
    setCustomInput(raw);

    // Aceita vazio e valores intermediários como "0." sem crash
    if (!raw || raw === "0" || raw === "0.") {
      onChange(0);
      return;
    }

    const parsed = parseFloat(raw);
    if (isNaN(parsed) || !isFinite(parsed)) return; // ignora silenciosamente
    onChange(Math.min(Math.max(parsed, 0), MAX_INITIAL_BUY_SOL));
  };

  const handleSkip = () => {
    onChange(0);
    setCustomInput("");
  };

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        isActive
          ? "border-[var(--gold)]/40 bg-[rgba(251,191,36,0.04)]"
          : "border-[var(--border)] bg-[var(--surface-1)]"
      )}
    >
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            isActive ? "bg-[var(--gold-dim)] text-[var(--gold)]" : "bg-[var(--surface-3)] text-[var(--text-muted)]"
          )}>
            <Coins className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Compra inicial{" "}
              <span className="text-xs font-normal text-[var(--text-muted)]">(opcional)</span>
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {isActive
                ? `${value} SOL → recebe ${formatCompact(tokensReceived)} ${symbol}`
                : "Compre seus próprios tokens antes do lançamento"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isActive && (
            <span className="text-xs font-bold text-[var(--gold)] bg-[var(--gold-dim)] px-2 py-0.5 rounded-full">
              {value} SOL
            </span>
          )}
          {expanded
            ? <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
            : <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />}
        </div>
      </button>

      {/* Corpo expansível */}
      {expanded && (
        <div className="border-t border-[var(--border)] px-5 pb-5 pt-4 space-y-4">

          {/* Taxa dinâmica */}
          <div className="flex items-start gap-2 rounded-lg bg-[var(--surface-2)] p-3">
            <Info className="h-3.5 w-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Taxa de lançamento:{" "}
              <span className="font-bold text-[var(--gold)]">
                1 SOL = {formatCompact(tokensPerSol)} {symbol || "tokens"}
              </span>
              {" "}(10% do fornecimento). Você é o primeiro comprador —{" "}
              vantagem de preço máxima.
            </p>
          </div>

          {/* Mensagem Raydium — verde */}
          <div className="flex items-start gap-2 rounded-lg border border-[var(--positive)]/30 bg-[rgba(34,197,94,0.06)] p-3">
            <svg className="h-3.5 w-3.5 text-[var(--positive)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-[var(--positive)] leading-relaxed">
              Adicione pelo menos{" "}
              <span className="font-bold">0.3 SOL</span>{" "}
              para criar a pool e listar automaticamente no Raydium.
              Com valores menores, o token ainda será criado normalmente,
              mas a negociação pública poderá ser ativada depois.
            </p>
          </div>

          {/* Botões preset */}
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              Valores rápidos
            </p>
            <div className="grid grid-cols-4 gap-2">
              {INITIAL_BUY_PRESETS_SOL.map(sol => (
                <button
                  key={sol}
                  type="button"
                  onClick={() => handlePreset(sol)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-xl py-3 px-2",
                    "border text-center transition-all duration-150 cursor-pointer",
                    value === sol
                      ? "border-[var(--gold)] bg-[var(--gold-dim)] shadow-[0_0_12px_rgba(251,191,36,0.2)]"
                      : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)]"
                  )}
                >
                  <span className={cn(
                    "text-sm font-extrabold",
                    value === sol ? "text-[var(--gold)]" : "text-[var(--text-primary)]"
                  )}>
                    {sol} SOL
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] leading-tight text-center">
                    {formatCompact(solToTokensAtLaunch(sol, safeSupply))}
                    <br />
                    {symbol || "tokens"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input personalizado */}
          <Input
            label="Valor personalizado (SOL)"
            type="number"
            placeholder="ex: 0.05"
            min={0}
            max={MAX_INITIAL_BUY_SOL}
            step={0.01}
            value={customInput}
            onChange={e => handleCustomChange(e.target.value)}
            rightAdornment={
              <span className="text-xs font-semibold text-[var(--gold)]">SOL</span>
            }
            hint={`Máximo ${MAX_INITIAL_BUY_SOL} SOL por criação`}
          />

          {/* Preview "Você terá" — só mostra quando há valor válido */}
          {value > 0 && tokensReceived > 0 && (
            <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--surface-2)] p-4 space-y-2">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Você receberá
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold-dim)]">
                  <Zap className="h-5 w-5 text-[var(--gold)]" fill="currentColor" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[var(--gold)] tabular-nums">
                    {formatCompact(tokensReceived)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {symbol || "TOKEN"} por {value} SOL · {pctOfSupply.toFixed(1)}% do supply
                  </p>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#fbbf24] to-[#d97706] transition-all duration-300"
                  style={{ width: `${Math.min(safe(value / MAX_INITIAL_BUY_SOL) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-[var(--text-muted)] text-right">
                {(safe(value / MAX_INITIAL_BUY_SOL) * 100).toFixed(1)}% do limite por lançamento
              </p>
            </div>
          )}

          {/* Pular */}
          {value > 0 && (
            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-xs text-[var(--text-muted)] hover:text-[var(--negative)] transition-colors py-1 cursor-pointer"
            >
              Pular compra inicial →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
