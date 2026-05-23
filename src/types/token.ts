export interface Token {
  mintAddress: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  bannerUrl: string;
  decimals: number;
  supply: number;
  creator: string;
  createdAt: Date;
  social: TokenSocialLinks;
  metadata?: TokenMetadata;
  stats?: TokenStats;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  externalUrl?: string;
  attributes?: TokenAttribute[];
}

export interface TokenAttribute {
  traitType: string;
  value: string | number;
}

export interface TokenStats {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  liquidity: number;
  txCount24h: number;
}

export interface TokenSocialLinks {
  twitter?:  string;
  telegram?: string;
  website?:  string;
  discord?:  string;
}

export interface TokenCreateInput {
  name: string;
  symbol: string;
  description: string;
  image: File | null;
  banner: File | null;
  decimals: number;
  initialSupply: number;
  /** Optional initial buy in SOL at launch rate (0 = skip) */
  initialBuySol: number;
  /** Social links shown on token page */
  social: TokenSocialLinks;
}

/**
 * Summary shown to the user before they sign the creation transaction.
 */
export interface TokenLaunchSummary {
  /** Fixed platform fee */
  creationFeeSol: number;
  /** Optional pre-buy SOL amount chosen by the creator */
  initialBuySol: number;
  /** Tokens the creator receives from the pre-buy */
  tokensReceived: number;
  /** Total SOL the wallet must have (creationFee + initialBuy + gas buffer) */
  totalCostSol: number;
}

export interface TokenListItem extends Token {
  rank?: number;
  isTrending?: boolean;
  isNew?: boolean;
}
