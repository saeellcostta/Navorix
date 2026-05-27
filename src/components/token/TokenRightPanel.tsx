"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { TradePanel } from "@/components/token/TradePanel";
import { AddLiquidityButton } from "@/components/token/AddLiquidityButton";
import { BondingBuyPanel } from "@/components/token/BondingBuyPanel";

interface Props {
  mintAddress:           string;
  tokenSymbol:           string;
  creatorWallet:         string;
  status:                string;
  escrowSol:             number;
  graduationThreshold:   number;
  poolId:                string | null;
  solReserve:            number;
  tokenReserve:          number;
}

export function TokenRightPanel({
  mintAddress,
  tokenSymbol,
  creatorWallet,
  status,
  escrowSol,
  graduationThreshold,
  poolId,
  solReserve,
  tokenReserve,
}: Props) {
  const { publicKey } = useWallet();
  const isCreator   = !!publicKey && publicKey.toBase58() === creatorWallet;
  const isLaunching = status === "launching";

  if (isLaunching) {
    // Token em LAUNCHING:
    // Criador → AddLiquidityButton para criar a pool e graduar
    // Outros  → BondingBuyPanel para compra antecipada
    return isCreator ? (
      <AddLiquidityButton
        mintAddress={mintAddress}
        tokenSymbol={tokenSymbol}
        solReserve={solReserve}
        tokenReserve={tokenReserve}
      />
    ) : (
      <BondingBuyPanel
        mintAddress={mintAddress}
        tokenSymbol={tokenSymbol}
        escrowSol={escrowSol}
        graduationThreshold={graduationThreshold}
      />
    );
  }

  // Token LIVE:
  // Todos veem TradePanel
  // Só o criador vê AddLiquidityButton
  return (
    <>
      <TradePanel
        mintAddress={mintAddress}
        tokenSymbol={tokenSymbol}
        poolId={poolId}
      />
      {isCreator && (
        <AddLiquidityButton
          mintAddress={mintAddress}
          tokenSymbol={tokenSymbol}
          solReserve={solReserve}
          tokenReserve={tokenReserve}
        />
      )}
    </>
  );
}
