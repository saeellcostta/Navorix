"use client";

/**
 * useTokenCreation — orchestrates the full token launch flow:
 *
 *  Step 1: Upload image to Supabase Storage
 *  Step 2: Upload off-chain metadata JSON to Irys/Arweave
 *  Step 3: Create SPL mint on Solana (3 transactions)
 *  Step 4: Create on-chain Metaplex metadata account
 *  Step 5: Register token in the Navorix database
 *
 * Returns a `create()` function + step/loading/error state for UI progress.
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
import { registerToken } from "@/services/api/tokenApi";
import type { TokenCreateInput } from "@/types/token";

export type CreationStep =
  | "idle"
  | "uploading_image"
  | "uploading_metadata"
  | "creating_mint"
  | "registering_metadata"
  | "saving_to_db"
  | "done"
  | "error";

export interface CreationResult {
  mintAddress: string;
  mintSignature: string;
  imageUrl: string;
  metadataUri: string;
}

const STEP_LABELS: Record<CreationStep, string> = {
  idle:                 "",
  uploading_image:      "Enviando imagem...",
  uploading_metadata:   "Subindo metadados para Arweave...",
  creating_mint:        "Criando token na Solana (3 transações)...",
  registering_metadata: "Registrando metadados on-chain...",
  saving_to_db:         "Salvando no banco de dados...",
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

      // ── Step 1: Upload image ──────────────────────────────
      let imageUrl = "";
      if (input.image) {
        setStep("uploading_image");
        // Use a temporary placeholder mint address for the path
        const tempId = `tmp_${Date.now()}`;
        imageUrl = await uploadTokenImage(input.image, tempId);
        toast.success("Imagem enviada ✓");
      }

      // ── Step 2: Upload off-chain metadata JSON ────────────
      setStep("uploading_metadata");
      const metadataJson = buildMetadataJson({
        name:          input.name,
        symbol:        input.symbol,
        description:   input.description,
        imageUrl,
        mintAddress:   "pending",   // filled after mint
        creatorWallet,
      });

      let metadataUri = "";
      try {
        // @ts-expect-error — wallet adapter type mismatch with UMI identity
        metadataUri = await uploadOffChainMetadata(wallet.adapter, metadataJson);
        toast.success("Metadados enviados ✓");
      } catch {
        // Non-fatal: continue without Arweave URI on devnet
        metadataUri = `https://navorix.exchange/tokens/meta/${input.symbol.toLowerCase()}.json`;
        toast.info("Arweave indisponível — usando URI padrão");
      }

      // ── Step 3: Create SPL mint (3 on-chain transactions) ─
      setStep("creating_mint");
      toast.loading("Aguardando assinaturas no Phantom...", { id: "mint" });

      const mintResult = await createSplToken(connection, wallet, input);
      toast.dismiss("mint");
      toast.success(`Mint criado: ${mintResult.mintAddress.slice(0, 8)}... ✓`);

      // ── Step 4: On-chain Metaplex metadata ───────────────
      setStep("registering_metadata");
      try {
        // @ts-expect-error — wallet adapter type mismatch
        await createOnChainMetadata(wallet.adapter, mintResult.mintAddress, metadataUri, input.name, input.symbol);
        toast.success("Metadados on-chain registrados ✓");
      } catch {
        // Metadata is optional — token works without it
        toast.info("Metadados on-chain: registre manualmente depois");
      }

      // ── Step 5: Save to Navorix DB ────────────────────────
      setStep("saving_to_db");
      await registerToken({
        mintAddress:   mintResult.mintAddress,
        name:          input.name,
        symbol:        input.symbol,
        description:   input.description,
        imageUrl,
        decimals:      input.decimals,
        initialSupply: input.initialSupply,
        creatorWallet,
        creationTx:    mintResult.mintSignature,
        initialBuySol: input.initialBuySol,
      });
      toast.success("Registrado no marketplace ✓");

      const final: CreationResult = {
        mintAddress:  mintResult.mintAddress,
        mintSignature: mintResult.mintSignature,
        imageUrl,
        metadataUri,
      };

      setStep("done");
      setResult(final);
      return final;

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStep("error");
      setError(msg);
      toast.dismiss("mint");
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
    loading: !["idle", "done", "error"].includes(step),
    error,
    result,
  };
}
