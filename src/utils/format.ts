/**
 * Format a number as USD currency.
 * Handles very small meme coin prices (e.g. $0.000000029)
 */
export function formatUsd(value: number, compact = false): string {
  if (!value || isNaN(value)) return "$0.00";

  if (compact) {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000)     return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000)         return `$${(value / 1_000).toFixed(2)}K`;
    if (value >= 0.01)          return `$${value.toFixed(2)}`;
    if (value >= 0.000001)      return `$${value.toFixed(6)}`;
    return `$${value.toExponential(2)}`;
  }

  // Full precision for token prices
  if (value >= 1)         return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (value >= 0.01)      return `$${value.toFixed(4)}`;
  if (value >= 0.0001)    return `$${value.toFixed(6)}`;
  if (value >= 0.0000001) return `$${value.toFixed(9)}`;

  // Very small values — use scientific notation style
  // e.g. $0.000029 shows as $0.000029
  const str = value.toPrecision(4);
  return `$${parseFloat(str)}`;
}

/**
 * Format a SOL amount with up to 4 decimal places.
 */
export function formatSol(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return `${sol.toLocaleString("en-US", { maximumFractionDigits: 4 })} SOL`;
}

/**
 * Format a wallet address to short form: first 4 + last 4 chars.
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format a percentage value with sign.
 */
export function formatPct(value: number, digits = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

/**
 * Format large numbers with K/M/B suffixes.
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Return a relative time string (e.g. "3m ago", "2h ago").
 */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
