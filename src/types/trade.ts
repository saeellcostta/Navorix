export type TradeDirection = "buy" | "sell";

export interface TradeInput {
  mintAddress: string;
  direction: TradeDirection;
  amountIn: number;
  slippagePct: number;
}

export interface TradeQuote {
  amountIn: number;
  amountOut: number;
  priceImpactPct: number;
  fee: number;
  minAmountOut: number;
}

export interface TradeTransaction {
  signature: string;
  mintAddress: string;
  direction: TradeDirection;
  amountIn: number;
  amountOut: number;
  fee: number;
  timestamp: Date;
  status: "pending" | "confirmed" | "failed";
}
