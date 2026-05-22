import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image optimization ─────────────────────────────────────────
  images: {
    remotePatterns: [
      // Supabase Storage (token images)
      {
        protocol: "https",
        hostname: "onnrvuahjzfhxvcdvzif.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Arweave (Metaplex off-chain metadata images)
      {
        protocol: "https",
        hostname: "arweave.net",
        pathname: "/**",
      },
      // IPFS gateways
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "**.mypinata.cloud",
        pathname: "/**",
      },
      // Solana token list CDN
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ── Security headers ───────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",     value: "nosniff" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https: wss:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      // Cache API responses
      {
        source: "/api/tokens",
        headers: [{ key: "Cache-Control", value: "s-maxage=10, stale-while-revalidate=30" }],
      },
      {
        source: "/api/pools",
        headers: [{ key: "Cache-Control", value: "s-maxage=15, stale-while-revalidate=60" }],
      },
    ];
  },

  // ── Turbopack config (Next.js 16 default bundler) ─────────────
  turbopack: {},
};

export default nextConfig;
