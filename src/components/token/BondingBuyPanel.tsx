"use client";

import { useState } from "react";
import { Rocket, AlertCircle, CheckCircle2, Lock, ExternalLink } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// ── Carteira que recebe o SOL das compras antecipadas ──
const ESCROW_WALLET = new PublicKey("86PTKN2kjsSv4JfrCbptz8HMpo6X2zwxeppLWYN1cGdN");

const TOKENS_PER_SOL = 100_000_000; // 100M tokens por SOL

function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

interface Props {
  mintAddress:         string;
  tokenSymbol:         string;
  escrowSol:           number;
  graduationThreshold: number;
  onSuccess?:          () => void;
}

export function BondingBuyPanel({
  mintAddress,
  tokenSymbol,
  escrowSol,
  graduationThreshold,
  onSuccess,
}: Props) {
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [solAmount, setSolAmount]   = useState("");
  const [loading, setLoading]       = useState(false);
  const [step, setStep]             = useState<string | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);
  const [txSig, setTxSig]           = useState<string | null>(null);

  const progressPct      = Math.min((escrowSol / graduationThreshold) * 100, 100);
  const remaining        = Math.max(graduationThreshold - escrowSol, 0);
  const estimatedTokens  = parseFloat(solAmount || "0") * TOKENS_PER_SOL;

  async function handleBuy() {
    if (!connected || !publicKey || !signTransaction) {
      setError("Conecte sua carteira primeiro.");
      return;
    }
    const sol = parseFloat(solAmount);
    if (!sol || sol <= 0) {
      setError("Digite um valor de SOL válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setStep("Preparando transação...");

    try {
      // ── 1. Monta transação SOL → carteira escrow ──
      setStep("Aguardando assinatura na carteira...");

      const lamports = Math.floor(sol * LAMPORTS_PER_SOL);

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey:   ESCROW_WALLET,
          lamports,
        })
      );

      const signed = await signTransaction(tx);

      setStep("Enviando transação...");
      const signature = await connection.sendRawTransaction(signed.serialize());

      setStep("Confirmando...");
      await connection.confirmTransaction(signature, "confirmed");

      setTxSig(signature);

      // ── 2. Registra no banco ──
      setStep("Registrando compra...");
      await fetch(`/api/bonding/${mintAddress}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerWallet:  publicKey.toBase58(),
          solAmount:    sol,
          tokenAmount:  estimatedTokens,
          txSignature:  signature,
        }),
      });

      setStep(null);
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        setSuccess(false);
        setSolAmount("");
      }, 4000);

    } catch (err) {
      setStep(null);
      const msg = err instanceof Error ? err.message : "Erro desconhecido.";
      setError(msg.includes("rejected") ? "Transação cancelada na carteira." : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .bbp-card {
          border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(251,191,36,0.2);
          background: #0d0d1a;
        }
        .bbp-header {
          background: linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.03));
          border-bottom: 1px solid rgba(251,191,36,0.12);
          padding: 1rem;
          display: flex; align-items: center; gap: 0.625rem;
        }
        .bbp-header-icon {
          width: 2rem; height: 2rem; border-radius: 50%;
          background: rgba(251,191,36,0.12);
          display: flex; align-items: center; justify-content: center;
          color: #fbbf24;
        }
        .bbp-title { font-size: 0.9375rem; font-weight: 700; color: #f9fafb; }
        .bbp-badge {
          margin-left: auto;
          font-size: 0.6875rem; font-weight: 700;
          background: rgba(251,191,36,0.12); color: #fbbf24;
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 999px; padding: 0.2rem 0.6rem;
        }
        .bbp-body { padding: 1rem; display: flex; flex-direction: column; gap: 1rem; }
        .bbp-progress-label {
          display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.5rem;
        }
        .bbp-progress-label-left { color: #9ca3af; }
        .bbp-progress-label-right { font-weight: 700; color: #fbbf24; }
        .bbp-progress-track {
          height: 0.5rem; border-radius: 999px;
          background: rgba(255,255,255,0.06); overflow: hidden; margin-bottom: 0.375rem;
        }
        .bbp-progress-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #fbbf24, #f59e0b); transition: width 0.4s ease;
        }
        .bbp-progress-sub { font-size: 0.6875rem; color: #6b7280; text-align: right; }
        .bbp-lock {
          display: flex; align-items: flex-start; gap: 0.5rem;
          background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.15);
          border-radius: 10px; padding: 0.625rem 0.75rem;
          font-size: 0.75rem; color: #d97706; line-height: 1.4;
        }
        .bbp-input-wrap {
          display: flex; align-items: center;
          background: #13132a; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; overflow: hidden; transition: border-color 0.15s;
        }
        .bbp-input-wrap:focus-within { border-color: rgba(251,191,36,0.4); }
        .bbp-input {
          flex: 1; background: transparent; border: none; outline: none;
          padding: 0.75rem 0.875rem; font-size: 1rem; font-weight: 600; color: #f9fafb;
        }
        .bbp-input::placeholder { color: #374151; font-weight: 400; }
        .bbp-input-suffix { padding: 0 0.875rem; font-size: 0.75rem; font-weight: 700; color: #fbbf24; }
        .bbp-quick { display: flex; gap: 0.375rem; }
        .bbp-quick-btn {
          flex: 1; padding: 0.35rem 0; font-size: 0.75rem; font-weight: 600;
          border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: #9ca3af; cursor: pointer; transition: all 0.15s;
        }
        .bbp-quick-btn:hover, .bbp-quick-btn.active {
          border-color: rgba(251,191,36,0.4); color: #fbbf24; background: rgba(251,191,36,0.06);
        }
        .bbp-estimate {
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px; padding: 0.625rem 0.75rem; font-size: 0.75rem;
        }
        .bbp-estimate-label { color: #6b7280; }
        .bbp-estimate-value { font-weight: 700; color: #f9fafb; }
        .bbp-step {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2);
          border-radius: 10px; padding: 0.625rem 0.75rem;
          font-size: 0.8125rem; color: #fbbf24;
        }
        .bbp-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(251,191,36,0.3); border-top-color: #fbbf24;
          animation: bbp-spin 0.8s linear infinite; flex-shrink: 0;
        }
        @keyframes bbp-spin { to { transform: rotate(360deg); } }
        .bbp-error {
          display: flex; align-items: flex-start; gap: 0.5rem;
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px; padding: 0.625rem 0.75rem;
          font-size: 0.8125rem; color: #f87171;
        }
        .bbp-success {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
          border-radius: 10px; padding: 0.75rem;
          font-size: 0.875rem; font-weight: 600; color: #4ade80; text-align: center;
        }
        .bbp-tx-link { font-size: 0.75rem; color: #4ade80; text-decoration: underline; font-weight: 400; }
        .bbp-btn {
          width: 100%; padding: 0.875rem; border-radius: 12px; border: none;
          font-size: 0.9375rem; font-weight: 700; cursor: pointer;
          background: linear-gradient(135deg, #fbbf24, #d97706);
          color: #08080f; transition: all 0.2s;
        }
        .bbp-btn:hover:not(:disabled) {
          transform: translateY(-1px); box-shadow: 0 8px 24px rgba(251,191,36,0.3);
        }
        .bbp-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      `}</style>

      <div className="bbp-card">
        <div className="bbp-header">
          <div className="bbp-header-icon"><Rocket size={14} /></div>
          <span className="bbp-title">Compra Antecipada</span>
          <span className="bbp-badge">🚀 LAUNCHING</span>
        </div>

        <div className="bbp-body">
          {/* Progresso */}
          <div>
            <div className="bbp-progress-label">
              <span className="bbp-progress-label-left">Progresso até graduação</span>
              <span className="bbp-progress-label-right">
                {escrowSol.toFixed(3)} / {graduationThreshold} SOL
              </span>
            </div>
            <div className="bbp-progress-track">
              <div className="bbp-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="bbp-progress-sub">
              Faltam {remaining.toFixed(3)} SOL para abrir negociação pública
            </div>
          </div>

          {/* Aviso de bloqueio */}
          <div className="bbp-lock">
            <Lock size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Tokens ficam bloqueados até a graduação. Quando atingir {graduationThreshold} SOL,
              a pool Raydium é criada e você pode negociar livremente.
            </span>
          </div>

          {/* Input SOL */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", marginBottom: "0.375rem" }}>
              Você paga
            </p>
            <div className="bbp-input-wrap">
              <input
                type="number" className="bbp-input" placeholder="0.0"
                value={solAmount} onChange={(e) => setSolAmount(e.target.value)}
                min="0" step="0.05"
              />
              <span className="bbp-input-suffix">SOL</span>
            </div>
          </div>

          {/* Valores rápidos */}
          <div className="bbp-quick">
            {["0.05", "0.1", "0.2", "0.3"].map((v) => (
              <button
                key={v}
                className={`bbp-quick-btn ${solAmount === v ? "active" : ""}`}
                onClick={() => setSolAmount(v)}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Estimativa */}
          {parseFloat(solAmount) > 0 && (
            <div className="bbp-estimate">
              <span className="bbp-estimate-label">Você receberá (estimado)</span>
              <span className="bbp-estimate-value">
                {formatCompact(estimatedTokens)} ${tokenSymbol}
              </span>
            </div>
          )}

          {/* Step */}
          {step && (
            <div className="bbp-step">
              <div className="bbp-spinner" />
              {step}
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="bbp-error">
              <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          {/* Sucesso */}
          {success && (
            <div className="bbp-success">
              <CheckCircle2 size={18} />
              Compra realizada! Tokens bloqueados até graduação.
              {txSig && (
                <a
                  href={`https://solscan.io/tx/${txSig}`}
                  target="_blank" rel="noopener noreferrer"
                  className="bbp-tx-link"
                >
                  Ver transação no Solscan <ExternalLink size={10} style={{ display: "inline" }} />
                </a>
              )}
            </div>
          )}

          <button
            className="bbp-btn"
            onClick={handleBuy}
            disabled={loading || success || !solAmount || parseFloat(solAmount) <= 0 || !connected}
          >
            {!connected
              ? "Conectar Carteira"
              : loading
                ? "Processando..."
                : success
                  ? "Comprado! 🎉"
                  : `Comprar ${tokenSymbol} Antecipado`
            }
          </button>
        </div>
      </div>
    </>
  );
}
