"use client";

/**
 * Supabase browser client.
 * Use this in Client Components ("use client").
 *
 * Uses @supabase/ssr createBrowserClient so auth cookies are
 * handled automatically by the SSR package.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
