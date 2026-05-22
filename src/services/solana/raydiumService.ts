"use client";

/**
 * Raydium CPMM Service
 *
 * Handles pool creation and token swaps using Raydium's
 * Constant Product Market Maker (CPMM) on Solana.
 *
 * Pool creation flow (called right after SPL mint):
 *  1. Initialize Raydium SDK with wallet connection
 *  2. Create CPMM pool: SOL + TOKEN
 *  3. Add initial liquidity (creator's SOL from initial buy)
 *  4. Return pool address → save in DB
 *
 * Swap flow (Buy/Sell):
 *  1. Fetch pool state from on-chain
 *  2. Calculate output amount (AMM formula)
 *  3. Build swap transaction
 *  4. Sign and send via wallet
 */

import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { SOLANA_RPC_ENDPOINT, SOLANA_NETWORK, TRADE_FEE_PCT, FEE_WALLET_ADDRESS } from "@/config/solana";

// ─── Raydium SDK types (loaded dynamically to avoid SSR issues) ───

export interface CpmmPoolInfo {
  poolId: string;
  mintA:  string;  // SOL (WSOL)
  mintB:  string;  // SPL token
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

// Raydium devnet/mainnet program IDs
const RAYDIUM_CPMM_PROGRAM = {
  "mainnet-beta": "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
  "devnet":       "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C",
  "testnet":      "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C",
} as const;

// WSOL mint address (same on all clusters)
export const WSOL_MINT = "So11111111111111111111111111111111111111112";

/**
 * Initialize the Raydium SDK instance.
 * All imports are dynamic to prevent SSR HTTP connection errors.
 */
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

// ─── POOL CREATION ───────────────────────────────────────────────

export interface CreatePoolInput {
  mintAddress:    string;  // SPL token mint
  solAmountLamports: number;  // Initial SOL liquidity (lamports)
  tokenAmount:    number;  // Initial token liquidity (raw units)
  decimals:       number;  // Token decimals
}

export interface CreatePoolResult {
  poolId:    string;
  signature: string;
}

/**
 * Create a new Raydium CPMM pool for a token.
 * Called automatically after token creation when initialBuySol > 0.
 *
 * The pool seeds liquidity with:
 *   - solAmountLamports of WSOL
 *   - tokenAmount of the newly minted SPL token
 */
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

  // Fetch fee configs from on-chain program
  const feeConfigs = await cpmmModule.getAmmConfigId?.() ??
    await cpmmModule.fetchAllConfigAccount?.() ??
    [];
  const feeConfig = Array.isArray(feeConfigs) ? feeConfigs[0] : feeConfigs;

  const { execute, extInfo } = await cpmmModule.createPool({
    programId:        new PublicKey(RAYDIUM_CPMM_PROGRAM[SOLANA_NETWORK]),
    poolFeeAccount:   CREATE_CPMM_POOL_FEE_ACC,
    feeConfig,
    mintA:            { address: WSOL_MINT,          decimals: 9,              programId: TOKEN_PROGRAM_ID.toBase58() },
    mintB:            { address: input.mintAddress,  decimals: input.decimals, programId: TOKEN_PROGRAM_ID.toBase58() },
    mintAAmount:      BigInt(input.solAmountLamports),
    mintBAmount:      BigInt(input.tokenAmount),
    startTime:        BigInt(Math.floor(Date.now() / 1000)),
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

// ─── SWAP ─────────────────────────────────────────────────────────

export interface SwapInput {
  poolId:     string;
  direction:  "buy" | "sell";  // buy = SOL→TOKEN, sell = TOKEN→SOL
  amountIn:   number;          // SOL (buy) or tokens (sell)
  slippagePct: number;         // e.g. 0.01 = 1%
}

/**
 * Get a swap quote without executing the transaction.
 */
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

  const amountOutRaw    = Number(result.destinationAmountSwapped);
  const feeRaw          = Number(result.tradeFee);
  const outputDecimals  = isBuy ? poolInfo.mintB.decimals : 9;
  const amountOut       = amountOutRaw / 10 ** outputDecimals;
  const fee             = feeRaw / (isBuy ? LAMPORTS_PER_SOL : 10 ** poolInfo.mintB.decimals);
  const priceImpact     = Number(result.priceImpact ?? 0) * 100;

  return {
    amountIn:       input.amountIn,
    amountOut,
    minAmountOut:   amountOut * (1 - input.slippagePct),
    priceImpactPct: priceImpact,
    fee,
    direction:      input.direction,
  };
}

/**
 * Execute a buy or sell swap via Raydium CPMM.
 * Returns the transaction signature.
 */
export async function executeSwap(
  connection:  Connection,
  wallet:      WalletContextState,
  input:       SwapInput,
  quote:       SwapQuote
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

  const minAmountOut = BigInt(
    Math.floor(quote.minAmountOut * 10 ** (isBuy ? poolInfo.mintB.decimals : 9))
  );

  const { execute } = await raydium.cpmm.swap({
    poolInfo,
    poolKeys,
    inputAmount:    BigInt(amountInRaw),
    swapResult,
    slippage:       input.slippagePct,
    baseIn:         isBuy,
    txVersion:      0,
    computeBudgetConfig: { microLamports: 100_000 },
  });

  const { txId } = await execute({ sendAndConfirm: true });
  return txId;
}
