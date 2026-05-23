"use client";

/**
 * Solana SPL Token Service — REAL on-chain creation
 *
 * Complete flow:
 *  TX 1 — Fee + initial buy:
 *    • Transfer TOKEN_CREATION_FEE_SOL → FEE_WALLET
 *    • Transfer initialBuySol          → FEE_WALLET  (optional pre-buy)
 *
 *  TX 2 — Create mint:
 *    • SystemProgram.createAccount  (ephemeral Keypair = mint account)
 *    • Token.initializeMint
 *    Signed by: wallet (fee payer) + ephemeral keypair (mint authority)
 *
 *  TX 3 — Mint supply:
 *    • createAssociatedTokenAccount
 *    • mintTo(initialSupply) → creator ATA
 *
 * All transactions use wallet.signTransaction() — private key never stored.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import {
  TOKEN_CREATION_FEE_SOL,
  FEE_WALLET_ADDRESS,
  LAMPORTS_PER_SOL,
  solToTokensAtLaunch,
  totalLaunchCostSol,
} from "@/config/solana";
import type { TokenCreateInput } from "@/types/token";

export interface CreateTokenResult {
  mintAddress:    string;
  feeSignature:   string;
  mintSignature:  string;
  tokensReceived: number;
}

/**
 * Create a real SPL Token on Solana.
 * Returns mint address and transaction signatures.
 */
export async function createSplToken(
  connection: Connection,
  wallet: WalletContextState,
  input: TokenCreateInput
): Promise<CreateTokenResult> {
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    throw new Error("Carteira não conectada");
  }

  const payer     = wallet.publicKey;
  const feeWallet = new PublicKey(FEE_WALLET_ADDRESS);

  // ── 1. Check balance ────────────────────────────────────────
  const balance  = await connection.getBalance(payer);
  const required = Math.ceil(totalLaunchCostSol(input.initialBuySol) * LAMPORTS_PER_SOL) + 100_000;
  if (balance < required) {
    const need = (required / LAMPORTS_PER_SOL).toFixed(4);
    const have = (balance  / LAMPORTS_PER_SOL).toFixed(4);
    throw new Error(`Saldo insuficiente: ${have} SOL disponível, necessário ~${need} SOL`);
  }

  const tokensReceived = solToTokensAtLaunch(input.initialBuySol);

  // ── 2. TX 1: Platform fee + optional initial buy ─────────────
  const { blockhash: bh1, lastValidBlockHeight: lv1 } = await connection.getLatestBlockhash();
  const feeTx = new Transaction({ recentBlockhash: bh1, feePayer: payer });

  feeTx.add(SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey:   feeWallet,
    lamports:   Math.floor(TOKEN_CREATION_FEE_SOL * LAMPORTS_PER_SOL),
  }));

  if (input.initialBuySol > 0) {
    feeTx.add(SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey:   feeWallet,
      lamports:   Math.floor(input.initialBuySol * LAMPORTS_PER_SOL),
    }));
  }

  const signedFeeTx  = await wallet.signTransaction(feeTx);
  const feeSignature = await connection.sendRawTransaction(signedFeeTx.serialize());
  await connection.confirmTransaction({ signature: feeSignature, blockhash: bh1, lastValidBlockHeight: lv1 }, "confirmed");

  // ── 3. TX 2: Create mint account ────────────────────────────
  const mintKeypair  = Keypair.generate();
  const mintPubkey   = mintKeypair.publicKey;
  const rentLamports = await getMinimumBalanceForRentExemptMint(connection);

  const { blockhash: bh2, lastValidBlockHeight: lv2 } = await connection.getLatestBlockhash();
  const mintTx = new Transaction({ recentBlockhash: bh2, feePayer: payer });

  mintTx.add(
    SystemProgram.createAccount({
      fromPubkey:       payer,
      newAccountPubkey: mintPubkey,
      space:            MINT_SIZE,
      lamports:         rentLamports,
      programId:        TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintPubkey,
      input.decimals,
      payer, // mint authority = creator
      payer  // freeze authority = creator
    )
  );

  mintTx.partialSign(mintKeypair);
  const signedMintTx = await wallet.signTransaction(mintTx);
  const mintSignature = await connection.sendRawTransaction(signedMintTx.serialize());
  await connection.confirmTransaction({ signature: mintSignature, blockhash: bh2, lastValidBlockHeight: lv2 }, "confirmed");

  // ── 4. TX 3: Create ATA + mint supply ───────────────────────
  const ata = await getAssociatedTokenAddress(mintPubkey, payer);

  const { blockhash: bh3, lastValidBlockHeight: lv3 } = await connection.getLatestBlockhash();
  const supplyTx = new Transaction({ recentBlockhash: bh3, feePayer: payer });

  supplyTx.add(
    createAssociatedTokenAccountInstruction(payer, ata, payer, mintPubkey)
  );

  const supplyRaw = BigInt(input.initialSupply) * BigInt(10 ** input.decimals);
  supplyTx.add(
    createMintToInstruction(mintPubkey, ata, payer, supplyRaw)
  );

  const signedSupplyTx   = await wallet.signTransaction(supplyTx);
  // ✅ FIX: captura a assinatura da TX3 e confirma com ela (não com mintSignature da TX2)
  const supplySignature  = await connection.sendRawTransaction(signedSupplyTx.serialize());
  await connection.confirmTransaction({ signature: supplySignature, blockhash: bh3, lastValidBlockHeight: lv3 }, "confirmed");

  return {
    mintAddress:    mintPubkey.toBase58(),
    feeSignature,
    mintSignature,
    tokensReceived,
  };
}

/**
 * Fetch the SOL balance for a given public key (in SOL, not lamports).
 */
export async function getSolBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  const lamports = await connection.getBalance(publicKey);
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Fetch all SPL token accounts owned by a wallet.
 */
export async function getTokenAccounts(
  connection: Connection,
  ownerKey: PublicKey
) {
  const response = await connection.getParsedTokenAccountsByOwner(ownerKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  return response.value
    .map((item) => {
      const info = item.account.data.parsed.info;
      return {
        mintAddress: info.mint as string,
        balance:     Number(info.tokenAmount.uiAmount ?? 0),
        decimals:    Number(info.tokenAmount.decimals),
        rawAmount:   info.tokenAmount.amount as string,
      };
    })
    .filter((t) => t.balance > 0);
}
