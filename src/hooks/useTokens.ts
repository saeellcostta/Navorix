"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchTokens } from "@/services/api/tokenApi";
import type { TokenListItem } from "@/types/token";

interface UseTokensOptions {
  sort?: "trending" | "new" | "marketcap" | "volume";
  limit?: number;
}

export function useTokens(options: UseTokensOptions = {}) {
  const { sort = "trending", limit = 20 } = options;
  const [tokens, setTokens] = useState<TokenListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTokens({ sort, limit });
      setTokens(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tokens");
    } finally {
      setLoading(false);
    }
  }, [sort, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { tokens, loading, error, refresh: load };
}
