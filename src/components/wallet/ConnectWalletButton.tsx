"use client";

import React, { useState } from "react";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletSelectModal } from "./WalletSelectModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ConnectWalletButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
}

export function ConnectWalletButton({
  className,
  size = "md",
  label = "Conectar Carteira",
}: ConnectWalletButtonProps) {
  const { connecting } = useWallet();
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const sizeClasses = {
    sm: "h-8  px-4 text-xs",
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-7 text-base",
    xl: "h-14 px-8 text-lg",
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        disabled={connecting}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
          "bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#08080f]",
          "hover:from-[#fcd34d] hover:to-[#f59e0b]",
          "shadow-[0_0_16px_rgba(251,191,36,0.25)] hover:shadow-[0_0_24px_rgba(251,191,36,0.4)]",
          "transition-all duration-200",
          "disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer",
          sizeClasses[size],
          className
        )}
      >
        <Wallet className="h-4 w-4" />
        {connecting ? t.wallet.connecting : (label === "Conectar Carteira" ? t.wallet.connect : label)}
      </button>

      <WalletSelectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
