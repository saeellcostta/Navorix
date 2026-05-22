export interface Token {
  mintAddress: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  decimals: number;
  supply: number;
  creator: string;
  createdAt: Date;
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

export interface TokenCreateInput {
  name: string;
  symbol: string;
  description: string;
  image: File | null;
  decimals: number;
  initialSupply: number;
}

export interface TokenListItem extends Token {
  rank?: number;
  isTrending?: boolean;
  isNew?: boolean;
}
