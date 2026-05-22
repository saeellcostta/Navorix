import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPct } from "@/utils/format";

interface PriceChangeProps {
  value: number;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceChange({ value, showIcon = true, className, size = "md" }: PriceChangeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isZero = value === 0;

  const sizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold tabular-nums",
        sizeMap[size],
        isPositive && "text-[var(--positive)]",
        isNegative && "text-[var(--negative)]",
        isZero     && "text-[var(--text-muted)]",
        className
      )}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
          {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
          {isZero     && <Minus className="h-3.5 w-3.5" />}
        </>
      )}
      {formatPct(value)}
    </span>
  );
}
