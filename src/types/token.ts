export type TokenStatus = "launching" | "live" | "graduated";
export type LaunchMode  = "instant"   | "bonding";

export interface Token {
  mintAddress:  string;
  name:         string;
  symbol:       string;
  description:  string;
  imageUrl:     string;
  bannerUrl:    string;
  decimals:     number;
  supply:       number;
  creator:      string;
  createdAt:    Date;
  social:       TokenSocialLinks;
  metadata?:    TokenMetadata;
  stats?:       TokenStats;

  /** Launch mode system */
  status:                  TokenStatus;
  launchMode:              LaunchMode;
  escrowSol:               number;
  graduationThresholdSol:  number;
}

export interface TokenMetadata {
  name:         string;
  symbol:       string;
  description:  string;
  image:        string;
  externalUrl?: string;
  attributes?:  TokenAttribute[];
}

export interface TokenAttribute {
  traitType: string;
  value:     string | number;
}

export interface TokenStats {
  price:          number;
  priceChange24h: number;
  marketCap:      number;
  volume24h:      number;
  holders:        number;
  liquidity:      number;
  txCount24h:     number;
}

export interface TokenSocialLinks {
  twitter?:  string;
  telegram?: string;
  website?:  string;
  discord?:  string;
}

export interface TokenCreateInput {
  name:          string;
  symbol:        string;
  description:   string;
  image:         File | null;
  banner:        File | null;
  decimals:      number;
  initialSupply: number;
  initialBuySol: number;
  social:        TokenSocialLinks;
}

export interface TokenLaunchSummary {
  creationFeeSol:  number;
  initialBuySol:   number;
  tokensReceived:  number;
  totalCostSol:    number;
}

export interface TokenListItem extends Token {
  rank?:       number;
  isTrending?: boolean;
  isNew?:      boolean;
}
