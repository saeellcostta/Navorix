/**
 * Rate Limiter — IP-based, in-memory sliding window
 *
 * Works on Vercel Edge/Node runtimes without external Redis.
 * For high-traffic production: swap the store for Upstash Redis.
 *
 * Usage in API routes:
 *   const result = rateLimit(req, { limit: 10, windowMs: 60_000 });
 *   if (!result.success) return result.response;
 */

import { NextRequest, NextResponse } from "next/server";

interface RateLimitStore {
  count:     number;
  resetAt:   number;
}

// In-memory store — resets on each Vercel function cold start
// For persistent limits: replace with Upstash Redis
const store = new Map<string, RateLimitStore>();

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (val.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Max requests per window */
  limit: number;
  /** Window duration in ms */
  windowMs: number;
  /** Optional key prefix to separate different routes */
  prefix?: string;
}

interface RateLimitResult {
  success:   boolean;
  remaining: number;
  resetAt:   number;
  /** Ready-to-return 429 response — only set when success is false */
  response?: NextResponse;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??  // Cloudflare
    req.headers.get("x-real-ip") ??          // Nginx proxy
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

export function rateLimit(req: NextRequest, options: RateLimitOptions): RateLimitResult {
  const { limit, windowMs, prefix = "rl" } = options;
  const ip  = getClientIp(req);
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request in this window
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      success:   false,
      remaining: 0,
      resetAt:   entry.resetAt,
      response:  NextResponse.json(
        {
          error: "Too many requests. Please slow down.",
          retryAfterSeconds: retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After":              String(retryAfter),
            "X-RateLimit-Limit":        String(limit),
            "X-RateLimit-Remaining":    "0",
            "X-RateLimit-Reset":        String(Math.ceil(entry.resetAt / 1000)),
          },
        }
      ),
    };
  }

  entry.count++;
  return {
    success:   true,
    remaining: limit - entry.count,
    resetAt:   entry.resetAt,
  };
}

// ── Pre-configured limiters for common use cases ──────────────

/** POST /api/tokens — 5 token creations per minute per IP */
export const tokenCreationLimiter = (req: NextRequest) =>
  rateLimit(req, { limit: 5, windowMs: 60_000, prefix: "create" });

/** POST /api/trades — 30 trades per minute per IP */
export const tradeLimiter = (req: NextRequest) =>
  rateLimit(req, { limit: 30, windowMs: 60_000, prefix: "trade" });

/** GET /api/tokens — 120 reads per minute per IP */
export const readLimiter = (req: NextRequest) =>
  rateLimit(req, { limit: 120, windowMs: 60_000, prefix: "read" });

/** POST /api/user — 10 per minute per IP */
export const userLimiter = (req: NextRequest) =>
  rateLimit(req, { limit: 10, windowMs: 60_000, prefix: "user" });
