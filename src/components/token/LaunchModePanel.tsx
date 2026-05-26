"use client";

import { Zap, Rocket, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  initialBuySol: number;
  onChange: (sol: number) => void;
}

const GRADUATION_THRESHOLD = 0.3;

export function LaunchModePanel({ initialBuySol, onChange }: Props) {
  const isInstant = initialBuySol >= GRADUATION_THRESHOLD;
  const mode = isInstant ? "instant" : "bonding";

  return (
    <div className="space-y-3">
      {/* Indicador de modo */}
      <div className={cn(
        "flex items-start gap-3 rounded-xl border p-4 transition-all",
        isInstant
          ? "border-[var(--positive)]/30 bg-[var(--positive)]/5"
          : "border-[var(--gold)]/30 bg-[var(--gold-dim)]"
      )}>
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          isInstant ? "bg-[var(--positive)]/15" : "bg-[var(--gold-dim)]"
        )}>
          {isInstant
            ? <Zap className="h-4 w-4 text-[var(--positive)]" />
            : <Rocket className="h-4 w-4 text-[var(--gold)]" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={cn(
              "text-sm font-bold",
              isInstant ? "text-[var(--positive)]" : "text-[var(--gold)]"
            )}>
              {isInstant ? "⚡ Instant Launch" : "🚀 Launching Mode"}
            </p>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              isInstant
                ? "bg-[var(--positive)]/15 text-[var(--positive)]"
                : "bg-[var(--gold)]/15 text-[var(--gold)]"
            )}>
              {isInstant ? "LIVE imediatamente" : "Bonding Phase"}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isInstant
              ? "Pool Raydium criada automaticamente. Token negociável imediatamente."
              : `Acumula SOL até ${GRADUATION_THRESHOLD} SOL para criar pool e liberar negociação.`
            }
          </p>
        </div>
      </div>

      {/* Barra de progresso para bonding */}
      {!isInstant && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Progresso até graduação</span>
            <span className="font-bold text-[var(--gold)]">
              {initialBuySol.toFixed(2)} / {GRADUATION_THRESHOLD} SOL
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-[#f59e0b] transition-all duration-300"
              style={{ width: `${Math.min((initialBuySol / GRADUATION_THRESHOLD) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              Compradores antecipados recebem tokens bloqueados. Quando atingir {GRADUATION_THRESHOLD} SOL,
              a pool Raydium é criada e os tokens são liberados automaticamente.
            </span>
          </div>
        </div>
      )}

      {/* Botões de seleção rápida */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange(0.1)}
          className={cn(
            "flex flex-col items-center rounded-xl border p-3 transition-all cursor-pointer",
            mode === "bonding" && initialBuySol === 0.1
              ? "border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
          )}
        >
          <Rocket className="h-4 w-4 mb-1" />
          <span className="text-xs font-bold">0.1 SOL</span>
          <span className="text-[10px] opacity-70">Launching Mode</span>
        </button>
        <button
          type="button"
          onClick={() => onChange(GRADUATION_THRESHOLD)}
          className={cn(
            "flex flex-col items-center rounded-xl border p-3 transition-all cursor-pointer",
            isInstant
              ? "border-[var(--positive)] bg-[var(--positive)]/5 text-[var(--positive)]"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
          )}
        >
          <Zap className="h-4 w-4 mb-1" />
          <span className="text-xs font-bold">0.3+ SOL</span>
          <span className="text-[10px] opacity-70">Instant Launch</span>
        </button>
      </div>
    </div>
  );
}
