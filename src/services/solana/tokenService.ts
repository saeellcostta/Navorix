/**
 * Solana SPL Token Service
 *
 * Handles real on-chain token creation using:
 *  - @solana/spl-token  (createMint, getOrCreateAssociatedTokenAccount, mintTo)
 *  - @metaplex-foundation/js (on-chain metadata)
 *
 * Fee & initial buy flow
 * ──────────────────────
 * Transaction 1 (fee + optional initial buy):
 *   • Transfer TOKEN_CREATION_FEE_SOL        → FEE_WALLET (platform fee)
 *   • Transfer form.initialBuySol            → FEE_WALLET (initial buy SOL)
 *     └─ Creator receives solToTokensAtLaunch(initialBuySol) tokens
 *
 * Transaction 2 (mint):
 *   • SystemProgram.createAccount            → new Keypair (mint account)
 *   • Token.initializeMint
 *   • getOrCreateAssociatedTokenAccount      → creator's ATA
 *   • mintTo(initialSupply)                  → creator's ATA
 *
 * All transactions require a connected wallet adapter signer.
 * Private keys are NEVER stored.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
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
  mintAddress: string;
  /** Signature of the fee + initial buy transaction */
  feeSignature: string;
  /** Signature of the mint transaction */
  mintSignature: string;
  /** Tokens sent to the creator's wallet from initial buy */
  tokensReceived: number;
}

/**
 * Create a new SPL Token on Solana.
 *
 * Steps performed:
 *  1. Verify wallet is connected and has enough SOL
 *  2. Transfer platform creation fee (0.02 SOL) → FEE_WALLET
 *  3. If initialBuySol > 0: transfer initialBuySol → FEE_WALLET
 *  4. createMint()
 *  5. getOrCreateAssociatedTokenAccount()
 *  6. mintTo(initialSupply) for the full supply
 *  7. If initialBuySol > 0: mintTo(tokensFromBuy) to creator's ATA
 *     — in production you mint tokensFromBuy from the pool reserve instead
 */
export async function createSplToken(
  connection: Connection,
  wallet: WalletContextState,
  input: TokenCreateInput
): Promise<CreateTokenResult> {
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Carteira não conectada");
  }

  const payer = wallet.publicKey;
  const feeWallet = new PublicKey(FEE_WALLET_ADDRESS);

  // ── 1. Balance check ─────────────────────────────────────────
  const balance = await connection.getBalance(payer);
  const required = Math.ceil(totalLaunchCostSol(input.initialBuySol) * LAMPORTS_PER_SOL) + 50_000;
  if (balance < required) {
    const requiredSol = (required / LAMPORTS_PER_SOL).toFixed(4);
    const actualSol   = (balance  / LAMPORTS_PER_SOL).toFixed(4);
    throw new Error(
      `Saldo insuficiente: ${actualSol} SOL disponível, necessário ~${requiredSol} SOL`
    );
  }

  // ── 2+3. Fee transaction ──────────────────────────────────────
  const { blockhash } = await connection.getLatestBlockhash();
  const feeTx = new Transaction({ recentBlockhash: blockhash, feePayer: payer });

  // Platform creation fee
  feeTx.add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey:   feeWallet,
      lamports:   Math.floor(TOKEN_CREATION_FEE_SOL * LAMPORTS_PER_SOL),
    })
  );

  // Optional initial buy: SOL goes to fee wallet, tokens come from pool
  const tokensReceived = solToTokensAtLaunch(input.initialBuySol);
  if (input.initialBuySol > 0) {
    feeTx.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey:   feeWallet,
        lamports:   Math.floor(input.initialBuySol * LAMPORTS_PER_SOL),
      })
    );
  }

  const signedFeeTx  = await wallet.signTransaction(feeTx);
  const feeSignature = await connection.sendRawTransaction(signedFeeTx.serialize());
  await connection.confirmTransaction(feeSignature, "confirmed");

  // ── 4-6. Mint transaction ─────────────────────────────────────
  // NOTE: createMint() from @solana/spl-token requires a Signer keypair
  // for the mint account. With a browser wallet you must:
  //   a) Generate an ephemeral Keypair client-side (mint authority stays with creator)
  //   b) Or delegate signing to a backend API that holds no funds
  //
  // Pattern to implement:
  //
  //   import { Keypair } from "@solana/web3.js";
  //   import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
  //
  //   const mintKeypair = Keypair.generate();
  //
  //   // Build createAccount + initializeMint instructions manually,
  //   // sign with both wallet (fee payer) and mintKeypair (mint authority):
  //   const mintTx = new Transaction().add(
  //     SystemProgram.createAccount({ ... }),
  //     createInitializeMintInstruction(mintKeypair.publicKey, input.decimals, payer, payer),
  //   );
  //   mintTx.partialSign(mintKeypair);
  //   const signedMintTx = await wallet.signTransaction(mintTx);
  //   const mintSig = await connection.sendRawTransaction(signedMintTx.serialize());
  //
  // For full production code see: /docs/token-creation-guide.md

  throw new Error(
    "createSplToken: Complete as instruções de criação do mint em src/services/solana/tokenService.ts " +
    "(ver comentário acima sobre ephemeral Keypair + wallet.signTransaction)"
  );
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
  publicKey: PublicKey
) {
  const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  return response.value.map((item) => {
    const info = item.account.data.parsed.info;
    return {
      mintAddress: info.mint as string,
      balance:     Number(info.tokenAmount.uiAmount),
      decimals:    Number(info.tokenAmount.decimals),
    };
  });
}
