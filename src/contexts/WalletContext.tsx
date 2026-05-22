"use client";

/**
 * WalletContext wraps @solana/wallet-adapter-react providers.
 *
 * Wallets supported: Phantom, Solflare, Backpack
 * Mobile: Phantom deep-link (dapp:// protocol) is handled automatically
 *         by @solana/wallet-adapter-phantom on mobile browsers.
 */

import React, { createContext, useContext, useMemo, useCallback, useEffect, useRef } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { SOLANA_NETWORK, SOLANA_RPC_ENDPOINT } from "@/config/solana";

// Import default wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

interface NavorixWalletContextValue {
  publicKeyStr: string | null;
  shortAddress: string | null;
  connected: boolean;
  connecting: boolean;
  disconnectWallet: () => Promise<void>;
}

const NavorixWalletContext = createContext<NavorixWalletContextValue | null>(null);

function NavorixWalletContextBridge({ children }: { children: React.ReactNode }) {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const upsertedRef = useRef<string | null>(null);

  const publicKeyStr = useMemo(() => publicKey?.toBase58() ?? null, [publicKey]);
  const shortAddress = useMemo(() => {
    if (!publicKeyStr) return null;
    return `${publicKeyStr.slice(0, 4)}...${publicKeyStr.slice(-4)}`;
  }, [publicKeyStr]);

  // Upsert user record in DB whenever a new wallet connects
  useEffect(() => {
    if (!connected || !publicKeyStr) return;
    if (upsertedRef.current === publicKeyStr) return;
    upsertedRef.current = publicKeyStr;

    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: publicKeyStr }),
    }).catch(() => {
      // Non-critical — silently fail if DB is not yet configured
    });
  }, [connected, publicKeyStr]);

  const disconnectWallet = useCallback(async () => {
    upsertedRef.current = null;
    await disconnect();
  }, [disconnect]);

  return (
    <NavorixWalletContext.Provider
      value={{ publicKeyStr, shortAddress, connected, connecting, disconnectWallet }}
    >
      {children}
    </NavorixWalletContext.Provider>
  );
}

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const network =
    SOLANA_NETWORK === "mainnet-beta"
      ? WalletAdapterNetwork.Mainnet
      : SOLANA_NETWORK === "testnet"
        ? WalletAdapterNetwork.Testnet
        : WalletAdapterNetwork.Devnet;

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      // BackpackWalletAdapter is injected via window.xnft — no explicit adapter needed
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <NavorixWalletContextBridge>{children}</NavorixWalletContextBridge>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function useNavorixWallet(): NavorixWalletContextValue {
  const ctx = useContext(NavorixWalletContext);
  if (!ctx) throw new Error("useNavorixWallet must be used inside WalletContextProvider");
  return ctx;
}

/** Re-export adapter hooks for convenience */
export { useWallet, useConnection };
