export type WalletNetwork = "mainnet-beta" | "devnet" | "testnet";

export interface WalletBalance {
  sol: number;
  tokens: TokenBalance[];
}

export interface TokenBalance {
  mintAddress: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  usdValue?: number;
}

export interface WalletState {
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  publicKey: string | null;
  balance: WalletBalance | null;
  network: WalletNetwork;
}

export type WalletAdapterName = "Phantom" | "Solflare" | "Backpack";
