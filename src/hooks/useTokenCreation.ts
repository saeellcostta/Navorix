"use client";

/**
 * useTokenCreation — orchestrates the full token launch flow:
 *
 *  Step 1: Upload image → Supabase Storage
 *  Step 2: Upload off-chain metadata JSON → Irys/Arweave
 *  Step 3: Create SPL mint on Solana (3 transactions signed by Phantom)
 *  Step 4: Create on-chain Metaplex metadata account
 *  Step 5: Create Raydium CPMM pool (when initialBuySol > 0)
 *  Step 6: Register token + pool in the Navorix database
 */

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { createSplToken } from "@/services/solana/tokenService";
import { uploadTokenImage } from "@/services/storage/imageService";
import {
  buildMetadataJson,
  uploadOffChainMetadata,
  createOnChainMetadata,
} from "@/services/solana/metadataService";
import { createCpmmPool } from "@/services/solana/raydiumService";
import { registerToken } from "@/services/api/tokenApi";
import { LAMPORTS_PER_SOL, solToTokensAtLaunch, getTokensPerSol } from "@/config/solana";
import type { TokenCreateInput } from "@/types/token";

export type CreationStep =
  | "idle"
  | "uploading_image"
  | "uploading_metadata"
  | "creating_mint"
  | "registering_metadata"
  | "creating_pool"
  | "saving_to_db"
  | "done"
  | "error";

export interface CreationResult {
  mintAddress:  string;
  mintSignature: string;
  imageUrl:     string;
  metadataUri:  string;
  poolId?:      string;
}

const STEP_LABELS: Record<CreationStep, string> = {
  idle:                 "",
  uploading_image:      "Enviando imagem...",
  uploading_metadata:   "Subindo metadados para Arweave...",
  creating_mint:        "Criando token na Solana (3 transações)...",
  registering_metadata: "Registrando metadados on-chain...",
  creating_pool:        "Criando pool de liquidez Raydium...",
  saving_to_db:         "Salvando no marketplace...",
  done:                 "Token criado com sucesso!",
  error:                "Erro na criação",
};

export function useTokenCreation() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [step, setStep]     = useState<CreationStep>("idle");
  const [error, setError]   = useState<string | null>(null);
  const [result, setResult] = useState<CreationResult | null>(null);

  const create = useCallback(async (input: TokenCreateInput): Promise<CreationResult | null> => {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error("Conecte sua carteira primeiro");
      return null;
    }

    setStep("idle");
    setError(null);
    setResult(null);

    try {
      const creatorWallet = wallet.publicKey.toBase58();

      // ── Step 1: Upload imagem + banner ───────────────────────
      let imageUrl  = "";
      let bannerUrl = "";
      if (input.image || input.banner) {
        setStep("uploading_image");
        const tempId = `tmp_${Date.now()}`;
        if (input.image) {
          imageUrl  = await uploadTokenImage(input.image,  tempId, "logo");
        }
        if (input.banner) {
          bannerUrl = await uploadTokenImage(input.banner, tempId, "banner");
        }
        toast.success("Mídia enviada ✓");
      }

      // ── Step 2: Metadados off-chain (Arweave) ─────────────────
      setStep("uploading_metadata");
      const metadataJson = buildMetadataJson({
        name: input.name, symbol: input.symbol,
        description: input.description, imageUrl,
        mintAddress: "pending", creatorWallet,
      });

      let metadataUri = "";
      try {
        // @ts-expect-error — wallet adapter type mismatch with UMI identity
        metadataUri = await uploadOffChainMetadata(wallet.adapter, metadataJson);
        toast.success("Metadados enviados ✓");
      } catch {
        metadataUri = `https://navorix.exchange/tokens/meta/${input.symbol.toLowerCase()}.json`;
        toast.info("Arweave indisponível — usando URI padrão");
      }

      // ── Step 3: Criar mint SPL (3 txs no Phantom) ────────────
      setStep("creating_mint");
      toast.loading("Aguardando assinaturas no Phantom...", { id: "mint" });
      const mintResult = await createSplToken(connection, wallet, input);
      toast.dismiss("mint");
      toast.success(`Mint criado ✓`);

      // ── Step 4: Metadados on-chain (Metaplex) ─────────────────
      setStep("registering_metadata");
      try {
        // @ts-expect-error — wallet adapter type mismatch
        await createOnChainMetadata(wallet.adapter, mintResult.mintAddress, metadataUri, input.name, input.symbol);
        toast.success("Metadados on-chain ✓");
      } catch {
        toast.info("Metadados on-chain: registre manualmente depois");
      }

      // ── Step 5: Criar pool Raydium CPMM ──────────────────────
      let poolId: string | undefined;

      if (input.initialBuySol > 0) {
        setStep("creating_pool");
        toast.loading("Criando pool Raydium...", { id: "pool" });

        try {
          const tokensForPool = solToTokensAtLaunch(input.initialBuySol, input.initialSupply);
          const tokenDecimals = input.decimals;

          const poolResult = await createCpmmPool(connection, wallet, {
            mintAddress:       mintResult.mintAddress,
            solAmountLamports: Math.floor(input.initialBuySol * LAMPORTS_PER_SOL),
            tokenAmount:       tokensForPool * 10 ** tokenDecimals,
            decimals:          tokenDecimals,
          });

          poolId = poolResult.poolId;
          toast.dismiss("pool");
          toast.success(`Pool Raydium criada ✓`);
        } catch (poolErr) {
          toast.dismiss("pool");
          // Pool creation failure is non-fatal — token still exists
          toast.error(
            `Pool não criada: ${poolErr instanceof Error ? poolErr.message : "erro"}. ` +
            "Você pode criar a pool depois manualmente."
          );
        }
      }

      // ── Step 6: Salvar no banco ───────────────────────────────
      setStep("saving_to_db");
      await registerToken({
        mintAddress:    mintResult.mintAddress,
        name:           input.name,
        symbol:         input.symbol,
        description:    input.description,
        imageUrl,
        bannerUrl,
        decimals:       input.decimals,
        initialSupply:  input.initialSupply,
        creatorWallet,
        creationTx:     mintResult.mintSignature,
        initialBuySol:  input.initialBuySol,
        raydiumPoolId:  poolId,
        social:         input.social,
      });
      toast.success("Registrado no marketplace ✓");

      const final: CreationResult = {
        mintAddress:   mintResult.mintAddress,
        mintSignature: mintResult.mintSignature,
        imageUrl,
        metadataUri,
        poolId,
      };

      setStep("done");
      setResult(final);
      return final;

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStep("error");
      setError(msg);
      toast.dismiss("mint");
      toast.dismiss("pool");
      toast.error(msg);
      return null;
    }
  }, [wallet, connection]);

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
    setResult(null);
  }, []);

  return {
    create,
    reset,
    step,
    stepLabel: STEP_LABELS[step],
    loading:   !["idle", "done", "error"].includes(step),
    error,
    result,
  };
}
