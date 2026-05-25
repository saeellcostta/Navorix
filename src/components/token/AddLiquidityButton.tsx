"use client";

import { useState } from "react";
import { Droplets } from "lucide-react";
import { AddLiquidityModal } from "@/components/token/AddLiquidityModal";

interface Props {
  mintAddress: string;
  tokenSymbol: string;
  solReserve: number;
  tokenReserve: number;
}

export function AddLiquidityButton({ mintAddress, tokenSymbol, solReserve, tokenReserve }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
        style={{
          background: "rgba(56,189,248,0.08)",
          border: "1px solid rgba(56,189,248,0.25)",
          color: "#38bdf8",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(56,189,248,0.15)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(56,189,248,0.08)";
        }}
      >
        <Droplets size={15} />
        Adicionar Liquidez
      </button>

      {open && (
        <AddLiquidityModal
          mintAddress={mintAddress}
          tokenSymbol={tokenSymbol}
          solReserve={solReserve}
          tokenReserve={tokenReserve}
          onClose={() => setOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </>
  );
}
