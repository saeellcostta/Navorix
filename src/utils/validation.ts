/**
 * Validate a Solana public key string (base58, 32–44 chars).
 */
export function isValidPublicKey(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Validate a token symbol (1–10 uppercase alphanumeric chars).
 */
export function isValidTokenSymbol(symbol: string): boolean {
  return /^[A-Z0-9]{1,10}$/.test(symbol.toUpperCase());
}

/**
 * Validate a token name (1–32 printable chars).
 */
export function isValidTokenName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 32;
}

/**
 * Check that a number is a positive finite float.
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value) && value > 0;
}
