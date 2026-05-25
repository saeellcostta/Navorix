"use client";

import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { SOLANA_NETWORK, TRADE_FEE_PCT, FEE_WALLET_ADDRESS } from "@/config/solana";

export interface CpmmPoolInfo {
  poolId: string;
  mintA:  string;
  mintB:  string;
  lpMint: string;
}

export interface SwapQuote {
  amountIn:       number;
  amountOut:      number;
  minAmountOut:   number;
  priceImpactPct: number;
  fee:            number;
  direction:      "buy" | "sell";
}

const RAYDIUM_CPMM_PROGRAM = {
  "mainnet-beta": "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
  "devnet":       "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C",
  "testnet":      "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C",
} as const;

export const WSOL_MINT = "So11111111111111111111111111111111111111112";

async function initRaydium(connection: Connection, wallet: WalletContextState) {
  const { Raydium } = await import("@raydium-io/raydium-sdk-v2");

  const raydium = await Raydium.load({
    connection,
    owner:   wallet.publicKey ?? undefined,
    cluster: SOLANA_NETWORK === "mainnet-beta" ? "mainnet" : "devnet",
    disableFeatureCheck: true,
    blockhashCommitment: "confirmed",
  });

  return raydium;
}

export interface CreatePoolInput {
  mintAddress:       string;
  solAmountLamports: number;
  tokenAmount:       number;
  decimals:          number;
}

export interface CreatePoolResult {
  poolId:    string;
  signature: string;
}

export async function createCpmmPool(
  connection: Connection,
  wallet:     WalletContextState,
  input:      CreatePoolInput
): Promise<CreatePoolResult> {
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Carteira não conectada");
  }

  const raydium = await initRaydium(connection, wallet);
  const { CREATE_CPMM_POOL_FEE_ACC } = await import("@raydium-io/raydium-sdk-v2");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cpmmModule = raydium.cpmm as any;

  // Busca fee configs corretamente
  let feeConfig: unknown;
  try {
    const configs = await cpmmModule.fetchAllConfigAccount(
      new PublicKey(RAYDIUM_CPMM_PROGRAM[SOLANA_NETWORK])
    );
    feeConfig = Array.isArray(configs) && configs.length > 0 ? configs[0] : configs;
  } catch {
    // Fallback: tenta o método alternativo
    try {
      const configs = await cpmmModule.getAmmConfigId?.();
      feeConfig = Array.isArray(configs) ? configs[0] : configs;
    } catch {
      throw new Error("Não foi possível buscar as configurações de taxa do Raydium. Tente novamente.");
    }
  }

  if (!feeConfig) {
    throw new Error("Configuração de taxa do Raydium não encontrada.");
  }

  const { execute, extInfo } = await cpmmModule.createPool({
    programId:      new PublicKey(RAYDIUM_CPMM_PROGRAM[SOLANA_NETWORK]),
    poolFeeAccount: CREATE_CPMM_POOL_FEE_ACC,
    feeConfig,
    mintA: {
      address:   WSOL_MINT,
      decimals:  9,
      programId: TOKEN_PROGRAM_ID.toBase58(),
    },
    mintB: {
      address:   input.mintAddress,
      decimals:  input.decimals,
      programId: TOKEN_PROGRAM_ID.toBase58(),
    },
    mintAAmount:  BigInt(input.solAmountLamports),
    mintBAmount:  BigInt(input.tokenAmount),
    startTime:    BigInt(Math.floor(Date.now() / 1000)),
    ownerInfo: {
      feePayer:      wallet.publicKey,
      useSOLBalance: true,
    },
    associatedOnly:      false,
    checkCreateATAOwner: true,
    txVersion:           0,
  });

  const { txId } = await execute({ sendAndConfirm: true });

  return {
    poolId:    extInfo.address.poolId.toBase58(),
    signature: txId,
  };
}

export interface SwapInput {
  poolId:      string;
  direction:   "buy" | "sell";
  amountIn:    number;
  slippagePct: number;
}

export async function getSwapQuote(
  connection: Connection,
  input:      SwapInput
): Promise<SwapQuote> {
  const raydium = await initRaydium(connection, { publicKey: null } as unknown as WalletContextState);

  const poolData = await raydium.cpmm.getPoolInfoFromRpc(input.poolId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poolInfo = poolData.poolInfo as any;
  const poolKeys = poolData.poolKeys;

  const { CurveCalculator } = await import("@raydium-io/raydium-sdk-v2");

  const isBuy = input.direction === "buy";
  const amountInRaw = isBuy
    ? Math.floor(input.amountIn * LAMPORTS_PER_SOL)
    : Math.floor(input.amountIn * 10 ** poolInfo.mintB.decimals);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (CurveCalculator as any).swapBaseInput(
    BigInt(amountInRaw),
    isBuy ? poolInfo.baseReserve  : poolInfo.quoteReserve,
    isBuy ? poolInfo.quoteReserve : poolInfo.baseReserve,
    poolInfo.feeRate
  );

  const amountOutRaw   = Number(result.destinationAmountSwapped);
  const feeRaw         = Number(result.tradeFee);
  const outputDecimals = isBuy ? poolInfo.mintB.decimals : 9;
  const amountOut      = amountOutRaw / 10 ** outputDecimals;
  const fee            = feeRaw / (isBuy ? LAMPORTS_PER_SOL : 10 ** poolInfo.mintB.decimals);
  const priceImpact    = Number(result.priceImpact ?? 0) * 100;

  return {
    amountIn:       input.amountIn,
    amountOut,
    minAmountOut:   amountOut * (1 - input.slippagePct),
    priceImpactPct: priceImpact,
    fee,
    direction:      input.direction,
  };
}

export async function executeSwap(
  connection: Connection,
  wallet:     WalletContextState,
  input:      SwapInput,
  quote:      SwapQuote
): Promise<string> {
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Carteira não conectada");
  }

  const raydium = await initRaydium(connection, wallet);
  const { CurveCalculator } = await import("@raydium-io/raydium-sdk-v2");

  const poolData = await raydium.cpmm.getPoolInfoFromRpc(input.poolId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poolInfo = poolData.poolInfo as any;
  const poolKeys = poolData.poolKeys;

  const isBuy = input.direction === "buy";
  const amountInRaw = isBuy
    ? Math.floor(input.amountIn * LAMPORTS_PER_SOL)
    : Math.floor(input.amountIn * 10 ** poolInfo.mintB.decimals);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swapResult = (CurveCalculator as any).swapBaseInput(
    BigInt(amountInRaw),
    isBuy ? poolInfo.baseReserve  : poolInfo.quoteReserve,
    isBuy ? poolInfo.quoteReserve : poolInfo.baseReserve,
    poolInfo.feeRate
  );

  const { execute } = await raydium.cpmm.swap({
    poolInfo,
    poolKeys,
    inputAmount:  BigInt(amountInRaw),
    swapResult,
    slippage:     input.slippagePct,
    baseIn:       isBuy,
    txVersion:    0,
    computeBudgetConfig: { microLamports: 100_000 },
  });

  const { txId } = await execute({ sendAndConfirm: true });
  return txId;
}
