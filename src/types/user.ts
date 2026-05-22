export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: Date;
  stats?: UserStats;
}

export interface UserStats {
  tokensCreated: number;
  totalVolume: number;
  totalTrades: number;
  totalPnl: number;
}
