/**
 * Trade Service — Buy / Sell SPL Tokens via AMM bonding curve
 *
 * Architecture:
 *  - Bonding curve: constant product AMM (x * y = k)
 *  - Each token has its own SOL/TOKEN pool on-chain
 *  - Trades are signed by the connected wallet
 *
 * Fee routing:
 *  - 1% of every trade is transferred to the Navorix fee wallet:
 *    FvmN4BnLKR25QWXXoLof2RZFzwC8XU3QLcPr1aJg1UvQ
 *  - Fee is deducted from amountIn before the AMM swap calculation
 *
 * Integration points:
 *  - Replace pool state fetch with your on-chain program account read
 *  - Replace instruction building with your program's buy/sell instruction
 */

import type { Connection } from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { TRADE_FEE_PCT } from "@/config/solana";
import type { TradeInput, TradeQuote, TradeTransaction } from "@/types/trade";
import type { BondingCurveState } from "@/types/pool";

/**
 * Calculate a trade quote using the constant-product AMM formula.
 * No on-chain call — pure math on cached pool state.
 */
export function calculateTradeQuote(
  pool: BondingCurveState,
  input: TradeInput
): TradeQuote {
  const { direction, amountIn, slippagePct } = input;

  const solReserve = Number(pool.virtualSolReserves) / 1e9;
  const tokenReserve = Number(pool.virtualTokenReserves) / 1e6;

  const k = solReserve * tokenReserve;
  const fee = amountIn * TRADE_FEE_PCT;
  const effectiveIn = amountIn - fee;

  let amountOut: number;
  let newReserveIn: number;
  let newReserveOut: number;

  if (direction === "buy") {
    // SOL in, TOKEN out
    newReserveIn = solReserve + effectiveIn;
    newReserveOut = k / newReserveIn;
    amountOut = tokenReserve - newReserveOut;
  } else {
    // TOKEN in, SOL out
    newReserveIn = tokenReserve + effectiveIn;
    newReserveOut = k / newReserveIn;
    amountOut = solReserve - newReserveOut;
  }

  const spotPrice = direction === "buy" ? solReserve / tokenReserve : tokenReserve / solReserve;
  const executionPrice = amountIn / amountOut;
  const priceImpactPct = Math.abs((executionPrice - spotPrice) / spotPrice) * 100;

  return {
    amountIn,
    amountOut,
    priceImpactPct,
    fee,
    minAmountOut: amountOut * (1 - slippagePct),
  };
}

/**
 * Execute a buy or sell transaction on-chain.
 * Returns the transaction signature on success.
 *
 * Wire in your on-chain program call here.
 */
export async function executeTrade(
  connection: Connection,
  wallet: WalletContextState,
  input: TradeInput,
  quote: TradeQuote
): Promise<TradeTransaction> {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  // TODO: Build and send your program instruction.
  // Pattern:
  //   const ix = yourProgram.instruction.buy({ ... });
  //   const tx = new Transaction().add(ix);
  //   const signed = await wallet.signTransaction(tx);
  //   const sig = await connection.sendRawTransaction(signed.serialize());
  //   await connection.confirmTransaction(sig);

  throw new Error(
    "executeTrade: Connect your on-chain AMM program in src/services/solana/tradeService.ts"
  );
}
