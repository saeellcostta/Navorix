"use client";

import { useState, useEffect } from "react";
import { X, Droplets, AlertCircle, CheckCircle2 } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { createCpmmPool } from "@/services/solana/raydiumService";
import { LAMPORTS_PER_SOL } from "@/config/solana";

interface Props {
  mintAddress: string;
  tokenSymbol: string;
  solReserve: number;
  tokenReserve: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddLiquidityModal({
  mintAddress,
  tokenSymbol,
  solReserve,
  tokenReserve,
  onClose,
  onSuccess,
}: Props) {
  const { publicKey, connected } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [solAmount, setSolAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);

  // Calcula tokens proporcionais ao SOL digitado
  useEffect(() => {
    const sol = parseFloat(solAmount);
    if (!sol || sol <= 0 || solReserve === 0) {
      setTokenAmount("");
      return;
    }
    const ratio = tokenReserve / solReserve;
    setTokenAmount((sol * ratio).toFixed(2));
  }, [solAmount, solReserve, tokenReserve]);

  async function handleSubmit() {
    if (!connected || !publicKey) {
      setError("Conecte sua carteira primeiro.");
      return;
    }
    const sol = parseFloat(solAmount);
    const tokens = parseFloat(tokenAmount);
    if (!sol || sol <= 0) {
      setError("Digite um valor de SOL válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setStep("Preparando transação...");

    try {
      // Busca decimais do token no banco
      const tokenRes = await fetch(`/api/tokens?mint=${mintAddress}`);
      let decimals = 6;
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        if (Array.isArray(tokenData) && tokenData.length > 0) {
          decimals = tokenData[0].decimals ?? 6;
        }
      }

      setStep("Aguardando assinatura na Phantom...");

      // Cria pool Raydium CPMM on-chain
      const result = await createCpmmPool(connection, wallet, {
        mintAddress,
        solAmountLamports: Math.floor(sol * LAMPORTS_PER_SOL),
        tokenAmount: Math.floor(tokens * 10 ** decimals),
        decimals,
      });

      setStep("Confirmando transação...");
      setTxSig(result.signature);

      // Atualiza banco de dados
      await fetch(`/api/pools/${mintAddress}/liquidity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          solAmount: sol,
          tokenAmount: tokens,
          slippagePct: parseFloat(slippage) / 100,
          raydiumPoolId: result.poolId,
          txSignature: result.signature,
        }),
      });

      setStep(null);
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 3000);
    } catch (err) {
      setStep(null);
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .alm-backdrop {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .alm-modal {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          width: 100%; max-width: 420px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
          overflow: hidden;
        }
        .alm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.25rem 0;
        }
        .alm-title {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 1rem; font-weight: 700; color: #f9fafb;
        }
        .alm-title-icon { color: #38bdf8; }
        .alm-close {
          width: 2rem; height: 2rem;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: #6b7280; cursor: pointer;
          transition: all 0.15s;
        }
        .alm-close:hover { color: #f9fafb; border-color: rgba(255,255,255,0.2); }
        .alm-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
        .alm-pool-info {
          display: flex; gap: 0.5rem;
          background: rgba(56,189,248,0.06);
          border: 1px solid rgba(56,189,248,0.15);
          border-radius: 12px; padding: 0.75rem;
        }
        .alm-pool-item { flex: 1; text-align: center; }
        .alm-pool-label { font-size: 0.6875rem; color: #6b7280; margin-bottom: 0.2rem; }
        .alm-pool-value { font-size: 0.875rem; font-weight: 700; color: #f9fafb; }
        .alm-input-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .alm-label {
          font-size: 0.75rem; font-weight: 600;
          color: #9ca3af; display: flex; justify-content: space-between;
        }
        .alm-input-wrap {
          display: flex; align-items: center;
          background: #13132a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; overflow: hidden;
          transition: border-color 0.15s;
        }
        .alm-input-wrap:focus-within { border-color: rgba(56,189,248,0.4); }
        .alm-input {
          flex: 1; background: transparent; border: none; outline: none;
          padding: 0.75rem 0.875rem;
          font-size: 1rem; font-weight: 600; color: #f9fafb;
        }
        .alm-input::placeholder { color: #374151; font-weight: 400; }
        .alm-input-suffix {
          padding: 0 0.875rem;
          font-size: 0.75rem; font-weight: 700;
          color: #fbbf24; white-space: nowrap;
        }
        .alm-input[disabled] { color: #6b7280; }
        .alm-slippage { display: flex; gap: 0.375rem; }
        .alm-slip-btn {
          flex: 1; padding: 0.4rem;
          font-size: 0.75rem; font-weight: 600;
          border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: #9ca3af; cursor: pointer;
          transition: all 0.15s;
        }
        .alm-slip-btn.active, .alm-slip-btn:hover {
          border-color: rgba(251,191,36,0.4); color: #fbbf24;
          background: rgba(251,191,36,0.08);
        }
        .alm-slip-custom {
          width: 5rem;
          background: #13132a; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; outline: none;
          padding: 0.4rem 0.5rem; text-align: center;
          font-size: 0.75rem; font-weight: 600; color: #f9fafb;
        }
        .alm-summary {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 0.75rem;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .alm-summary-row { display: flex; justify-content: space-between; font-size: 0.75rem; }
        .alm-summary-label { color: #6b7280; }
        .alm-summary-value { color: #f9fafb; font-weight: 600; }
        .alm-step {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(251,191,36,0.08);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 10px; padding: 0.75rem;
          font-size: 0.8125rem; color: #fbbf24;
        }
        .alm-step-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(251,191,36,0.3);
          border-top-color: #fbbf24;
          animation: alm-spin 0.8s linear infinite; flex-shrink: 0;
        }
        @keyframes alm-spin { to { transform: rotate(360deg); } }
        .alm-error {
          display: flex; align-items: flex-start; gap: 0.5rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px; padding: 0.75rem;
          font-size: 0.8125rem; color: #f87171;
        }
        .alm-success {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 10px; padding: 0.75rem;
          font-size: 0.875rem; font-weight: 600; color: #4ade80; text-align: center;
        }
        .alm-tx-link {
          font-size: 0.75rem; color: #4ade80; text-decoration: underline; font-weight: 400;
        }
        .alm-btn {
          width: 100%; padding: 0.875rem;
          border-radius: 12px; border: none;
          font-size: 0.9375rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s;
          background: linear-gradient(135deg, #38bdf8, #0284c7);
          color: #fff;
        }
        .alm-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(56,189,248,0.3);
        }
        .alm-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      `}</style>

      <div className="alm-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="alm-modal">
          <div className="alm-header">
            <div className="alm-title">
              <Droplets size={16} className="alm-title-icon" />
              Adicionar Liquidez
            </div>
            <button className="alm-close" onClick={onClose}>
              <X size={14} />
            </button>
          </div>

          <div className="alm-body">
            <div className="alm-pool-info">
              <div className="alm-pool-item">
                <div className="alm-pool-label">Reserva SOL</div>
                <div className="alm-pool-value">{solReserve.toFixed(4)} SOL</div>
              </div>
              <div className="alm-pool-item">
                <div className="alm-pool-label">Reserva ${tokenSymbol}</div>
                <div className="alm-pool-value">{Number(tokenReserve).toLocaleString()}</div>
              </div>
            </div>

            <div className="alm-input-group">
              <div className="alm-label"><span>Você adiciona</span></div>
              <div className="alm-input-wrap">
                <input type="number" className="alm-input" placeholder="0.0"
                  value={solAmount} onChange={(e) => setSolAmount(e.target.value)} min="0" step="0.1" />
                <span className="alm-input-suffix">SOL</span>
              </div>
            </div>

            <div className="alm-input-group">
              <div className="alm-label">
                <span>Equivalente em tokens</span>
                <span style={{ color: "#6b7280" }}>Calculado automaticamente</span>
              </div>
              <div className="alm-input-wrap">
                <input type="number" className="alm-input" placeholder="0" value={tokenAmount} disabled />
                <span className="alm-input-suffix">${tokenSymbol}</span>
              </div>
            </div>

            <div className="alm-input-group">
              <div className="alm-label"><span>Tolerância de slippage</span></div>
              <div className="alm-slippage">
                {["0.5", "1", "2"].map((v) => (
                  <button key={v} className={`alm-slip-btn ${slippage === v ? "active" : ""}`}
                    onClick={() => setSlippage(v)}>{v}%</button>
                ))}
                <input type="number" className="alm-slip-custom" placeholder="Custom"
                  value={["0.5", "1", "2"].includes(slippage) ? "" : slippage}
                  onChange={(e) => setSlippage(e.target.value)} />
              </div>
            </div>

            {solAmount && parseFloat(solAmount) > 0 && (
              <div className="alm-summary">
                <div className="alm-summary-row">
                  <span className="alm-summary-label">SOL adicionado</span>
                  <span className="alm-summary-value">{parseFloat(solAmount).toFixed(4)} SOL</span>
                </div>
                <div className="alm-summary-row">
                  <span className="alm-summary-label">Tokens adicionados</span>
                  <span className="alm-summary-value">{parseFloat(tokenAmount || "0").toLocaleString()} ${tokenSymbol}</span>
                </div>
                <div className="alm-summary-row">
                  <span className="alm-summary-label">Slippage máximo</span>
                  <span className="alm-summary-value">{slippage}%</span>
                </div>
              </div>
            )}

            {step && (
              <div className="alm-step">
                <div className="alm-step-spinner" />
                {step}
              </div>
            )}

            {error && (
              <div className="alm-error">
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}

            {success && (
              <div className="alm-success">
                <CheckCircle2 size={18} />
                Liquidez adicionada com sucesso!
                {txSig && (
                  <a href={`https://solscan.io/tx/${txSig}`} target="_blank" rel="noopener noreferrer"
                    className="alm-tx-link">
                    Ver transação no Solscan
                  </a>
                )}
              </div>
            )}

            <button className="alm-btn" onClick={handleSubmit}
              disabled={loading || success || !solAmount || parseFloat(solAmount) <= 0}>
              {loading ? "Processando..." : success ? "Concluído!" : "Adicionar Liquidez"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
