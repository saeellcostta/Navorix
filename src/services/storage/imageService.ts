"use client";

/**
 * Image upload service — Supabase Storage
 *
 * Uploads token images to the "token-images" public bucket.
 * Returns a public URL used as image_url in the token record and on-chain metadata.
 *
 * Bucket setup (do once in Supabase dashboard):
 *   Storage → New bucket → name: "token-images" → Public: ON
 */

import { createBrowserClient } from "@supabase/ssr";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "token-images";

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Upload a token image file to Supabase Storage.
 * @param type "logo" | "banner"
 * Returns the public HTTPS URL.
 */
export async function uploadTokenImage(
  file: File,
  mintAddress: string,
  type: "logo" | "banner" = "logo"
): Promise<string> {
  const ext  = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${mintAddress}/${type}.${ext}`;

  const supabase = getClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete a token image (called if token creation fails after upload).
 */
export async function deleteTokenImage(mintAddress: string, ext = "png"): Promise<void> {
  const supabase = getClient();
  await supabase.storage
    .from(BUCKET)
    .remove([`${mintAddress}/logo.${ext}`]);
}
