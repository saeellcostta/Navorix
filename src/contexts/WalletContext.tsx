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
import { PhantomWalletAdapter }   from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter }  from "@solana/wallet-adapter-solflare";
import {
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
  BitgetWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";
import { SOLANA_NETWORK, SOLANA_RPC_ENDPOINT } from "@/config/solana";

const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "fed21e678856ac560536a95a93178b11";

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

/**
 * Detecta qual browser de carteira está sendo usado e retorna o nome do adapter.
 * Chamado uma vez no mount para auto-selecionar a carteira correta.
 */
function detectInjectedWallet(): string | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;

  // Phantom
  if (w.phantom?.solana || w.solana?.isPhantom) return "Phantom";

  // Solflare
  if (w.solflare || w.solana?.isSolflare) return "Solflare";

  // Trust Wallet — adapter name é "Trust", injeta window.trustwallet ou window.solana.isTrust
  if (w.trustwallet || w.trust || w.solana?.isTrust) return "Trust";

  // Backpack
  if (w.backpack || w.xnft) return "Backpack";

  // Bitget (antes chamado BitKeep)
  if (w.bitkeep?.solana || w.solana?.isBitKeep) return "Bitget Wallet";

  // Coinbase
  if (w.coinbaseSolana || w.solana?.isCoinbaseWallet) return "Coinbase Wallet";

  // Fallback por userAgent
  const ua = navigator.userAgent;
  if (ua.includes("Phantom"))  return "Phantom";
  if (ua.includes("Solflare")) return "Solflare";
  if (ua.includes("Trust"))    return "Trust";

  return null;
}

function NavorixWalletContextBridge({ children }: { children: React.ReactNode }) {
  const { publicKey, connected, connecting, disconnect, select, connect, wallets } = useWallet();
  const upsertedRef    = useRef<string | null>(null);
  const autoSelected   = useRef(false);

  const publicKeyStr = useMemo(() => publicKey?.toBase58() ?? null, [publicKey]);
  const shortAddress = useMemo(() => {
    if (!publicKeyStr) return null;
    return `${publicKeyStr.slice(0, 4)}...${publicKeyStr.slice(-4)}`;
  }, [publicKeyStr]);

  // Auto-seleciona a carteira quando o site abre dentro de um wallet browser
  useEffect(() => {
    if (connected || connecting || autoSelected.current) return;
    if (wallets.length === 0) return;

    const detected = detectInjectedWallet();
    if (!detected) return;

    const match = wallets.find(w =>
      w.adapter.name === detected ||
      w.adapter.name.toLowerCase().includes(detected.toLowerCase())
    );

    if (match && (match.readyState === "Installed" || match.readyState === "Loadable")) {
      autoSelected.current = true;
      select(match.adapter.name);
      // Aguarda o select processar e então chama connect para abrir o popup de aprovação
      setTimeout(() => {
        connect().catch(() => {
          // Ignora se falhar — usuário pode conectar manualmente
        });
      }, 300);
    }
  }, [connected, connecting, wallets, select, connect]);

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
      // ── Tier 1: mais populares ──
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),

      // ── Tier 2: muito usadas ──
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
      new BitgetWalletAdapter(),

      // ── Tier 3: hardware ──
      new LedgerWalletAdapter(),

      // ── WalletConnect: conecta Trust, Bitget, Coinbase e 300+ carteiras mobile ──
      new WalletConnectWalletAdapter({
        network: network === WalletAdapterNetwork.Testnet
          ? WalletAdapterNetwork.Devnet
          : network,
        options: {
          projectId: WALLETCONNECT_PROJECT_ID,
          metadata: {
            name:        "Navorix Exchange",
            description: "Premier Solana meme coin launchpad and DEX",
            url:         "https://navorix-exchange.vercel.app",
            icons:       ["https://navorix-exchange.vercel.app/favicon.ico"],
          },
        },
      }),

      // Backpack é injetado via window.xnft — detectado automaticamente
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
