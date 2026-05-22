"use client";

import { useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getSolBalance } from "@/services/solana/tokenService";

export function useSolBalance() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!publicKey || !connected) {
      setBalance(null);
      return;
    }
    setLoading(true);
    try {
      const sol = await getSolBalance(connection, publicKey);
      setBalance(sol);
    } catch {
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, connected]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balance, loading, refresh };
}
