"use client";

/**
 * Metaplex Token Metadata Service
 *
 * All heavy UMI imports are dynamic (loaded at runtime in the browser only)
 * to prevent Next.js SSR / build-time HTTP connection errors.
 */

import type { WalletAdapter } from "@solana/wallet-adapter-base";
import { SOLANA_RPC_ENDPOINT } from "@/config/solana";

export interface TokenMetadataInput {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  externalUrl?: string;
  mintAddress: string;
  creatorWallet: string;
}

/** Build Metaplex-standard off-chain metadata JSON */
export function buildMetadataJson(input: TokenMetadataInput): object {
  return {
    name:         input.name,
    symbol:       input.symbol,
    description:  input.description,
    image:        input.imageUrl,
    external_url: input.externalUrl ?? "",
    attributes:   [],
    properties: {
      files:    [{ uri: input.imageUrl, type: "image/png" }],
      category: "image",
      creators: [{ address: input.creatorWallet, share: 100 }],
    },
  };
}

/**
 * Upload off-chain metadata JSON to Irys (Arweave) via Metaplex UMI.
 * All imports are dynamic to avoid SSR connection issues.
 */
export async function uploadOffChainMetadata(
  wallet: WalletAdapter,
  metadataJson: object
): Promise<string> {
  const { createUmi }             = await import("@metaplex-foundation/umi-bundle-defaults");
  const { walletAdapterIdentity } = await import("@metaplex-foundation/umi-signer-wallet-adapters");
  const { irysUploader }          = await import("@metaplex-foundation/umi-uploader-irys");

  const umi = createUmi(SOLANA_RPC_ENDPOINT)
    .use(walletAdapterIdentity(wallet))
    .use(irysUploader());

  const [uri] = await umi.uploader.uploadJson([metadataJson]);
  return uri;
}

/**
 * Create the on-chain Token Metadata PDA (Metaplex standard).
 * Call AFTER the SPL mint is confirmed.
 */
export async function createOnChainMetadata(
  wallet: WalletAdapter,
  mintPubkey: string,
  metaUri: string,
  name: string,
  symbol: string
): Promise<string> {
  const { createUmi }                          = await import("@metaplex-foundation/umi-bundle-defaults");
  const { walletAdapterIdentity }              = await import("@metaplex-foundation/umi-signer-wallet-adapters");
  const { mplTokenMetadata, createMetadataAccountV3, findMetadataPda } =
    await import("@metaplex-foundation/mpl-token-metadata");
  const { publicKey }                          = await import("@metaplex-foundation/umi");

  const umi = createUmi(SOLANA_RPC_ENDPOINT)
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata());

  const mint = publicKey(mintPubkey);

  const tx = await createMetadataAccountV3(umi, {
    metadata:        findMetadataPda(umi, { mint }),
    mint,
    mintAuthority:   umi.identity,
    payer:           umi.identity,
    updateAuthority: umi.identity,
    data: {
      name,
      symbol,
      uri:                  metaUri,
      sellerFeeBasisPoints: 0,
      creators:             null,
      collection:           null,
      uses:                 null,
    },
    isMutable:         true,
    collectionDetails: null,
  }).sendAndConfirm(umi);

  return Buffer.from(tx.signature).toString("base64");
}
