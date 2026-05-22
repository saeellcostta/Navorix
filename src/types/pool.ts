export interface LiquidityPool {
  id: string;
  tokenMint: string;
  tokenSymbol: string;
  tokenName: string;
  tokenImageUrl: string;
  solReserve: number;
  tokenReserve: number;
  totalLiquidity: number;
  volume24h: number;
  feePct: number;
  price: number;
  priceChange24h: number;
  createdAt: Date;
}

export interface PoolPosition {
  poolId: string;
  owner: string;
  lpTokens: number;
  sharePercent: number;
  solValue: number;
  tokenValue: number;
}

export interface AddLiquidityInput {
  poolId: string;
  solAmount: number;
  tokenAmount: number;
  slippagePct: number;
}

export interface RemoveLiquidityInput {
  poolId: string;
  lpTokenAmount: number;
  slippagePct: number;
}

export interface BondingCurveState {
  mintAddress: string;
  virtualSolReserves: bigint;
  virtualTokenReserves: bigint;
  realSolReserves: bigint;
  realTokenReserves: bigint;
  tokenTotalSupply: bigint;
  complete: boolean;
}
