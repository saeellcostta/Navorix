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
  const isCreator   = publicKey?.toBase58() === creatorWallet;
  const isLaunching = status === "launching";

  // Token em LIVE → TradePanel para todos + AddLiquidityButton só para o criador
  if (!isLaunching) {
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

  // Token em LAUNCHING:
  // Criador → vê AddLiquidityButton para adicionar liquidez e graduar
  // Outros  → veem BondingBuyPanel para compra antecipada
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
