import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

/**
 * Next.js Middleware — runs on every matched request before route handlers.
 *
 * Applies:
 *  1. Rate limiting per IP on all /api/* routes
 *  2. Security headers (bot detection, request size)
 *  3. Cron job authentication guard
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Guard: Cron job routes require CRON_SECRET ──────────────
  if (pathname.startsWith("/api/cron/")) {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // ── Rate limiting on API routes ──────────────────────────────
  if (pathname.startsWith("/api/")) {
    // Determine limit based on method and route
    let limit    = 120;
    let windowMs = 60_000;

    if (req.method === "POST") {
      if (pathname.startsWith("/api/tokens")) {
        limit    = 5;   // max 5 token creations/min
        windowMs = 60_000;
      } else if (pathname.startsWith("/api/trades")) {
        limit    = 30;  // max 30 trades/min
        windowMs = 60_000;
      } else {
        limit = 20;
      }
    }

    const result = rateLimit(req, { limit, windowMs, prefix: `${req.method}:${pathname}` });
    if (!result.success && result.response) return result.response;

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit",     String(limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset",     String(Math.ceil(result.resetAt / 1000)));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
};
