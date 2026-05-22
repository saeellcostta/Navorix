# Navorix Exchange

**Premier Solana meme coin launchpad and decentralized exchange.**

Built with Next.js 16 · TypeScript · TailwindCSS v4 · Solana Web3.js · SPL Token · Metaplex

---

## Tech Stack

| Layer        | Library / Tool                          |
|--------------|----------------------------------------|
| Framework    | Next.js 16 (App Router, Turbopack)     |
| Language     | TypeScript 5                            |
| Styling      | TailwindCSS v4 + CSS variables          |
| Blockchain   | Solana Web3.js, SPL Token, Metaplex    |
| Wallets      | Phantom, Solflare, Backpack (via adapter)|
| Animations   | Framer Motion                           |
| Icons        | Lucide React                            |
| Charts       | Recharts (ready for integration)        |
| Notifications| Sonner                                  |

---

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx           # Root layout — providers, Navbar, Footer
│   ├── page.tsx             # Dashboard (home)
│   ├── tokens/              # Token marketplace
│   ├── token/[mint]/        # Token detail + trade panel
│   ├── trending/            # Trending tokens leaderboard
│   ├── create/              # SPL Token creator form
│   ├── pools/               # Liquidity pools list
│   ├── portfolio/           # Wallet portfolio
│   └── api/                 # REST API routes (tokens, pools)
│
├── components/
│   ├── ui/                  # Reusable primitives (Button, Card, Badge, Input, Modal, Tabs, Skeleton…)
│   ├── layout/              # Navbar, Footer
│   ├── wallet/              # WalletButton (connect/disconnect dropdown)
│   ├── token/               # TokenCard, TokenCreatorForm, TradePanel
│   ├── marketplace/         # TokensGrid, TokensFilter, TrendingClient
│   ├── pools/               # PoolCard, PoolsListClient
│   └── dashboard/           # HeroSection, StatsBar, TrendingSection, PortfolioClient
│
├── contexts/
│   └── WalletContext.tsx    # ConnectionProvider + WalletProvider + modal
│
├── hooks/
│   ├── useSolBalance.ts     # Live SOL balance for connected wallet
│   ├── useTokens.ts         # Token list fetching + filtering
│   └── useTradeQuote.ts     # AMM quote calculation (pure math, no RPC call)
│
├── services/
│   ├── solana/
│   │   ├── tokenService.ts  # createSplToken, getSolBalance, getTokenAccounts
│   │   └── tradeService.ts  # calculateTradeQuote, executeTrade
│   └── api/
│       └── tokenApi.ts      # REST client for /api/tokens
│
├── solana/
│   └── connection.ts        # Singleton Solana Connection
│
├── config/
│   ├── solana.ts            # RPC endpoint, fees, network, program IDs
│   └── site.ts              # Nav links, SEO, site metadata
│
├── types/
│   ├── token.ts             # Token, TokenMetadata, TokenStats, TokenCreateInput
│   ├── wallet.ts            # WalletState, WalletBalance, TokenBalance
│   ├── pool.ts              # LiquidityPool, PoolPosition, BondingCurveState
│   ├── trade.ts             # TradeInput, TradeQuote, TradeTransaction
│   └── user.ts              # User, UserStats
│
├── utils/
│   ├── format.ts            # formatUsd, formatSol, shortenAddress, formatPct, timeAgo
│   └── validation.ts        # isValidPublicKey, isValidTokenSymbol, isPositiveNumber
│
└── lib/
    └── utils.ts             # cn() helper (clsx + tailwind-merge)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Phantom Wallet (browser extension)
- Solana CLI (optional, for devnet)

### Setup

```bash
cd navorix-exchange
cp .env.example .env.local
# Fill in values in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

Key variables:

| Variable                        | Description                        |
|---------------------------------|------------------------------------|
| `NEXT_PUBLIC_SOLANA_NETWORK`    | `devnet` or `mainnet-beta`         |
| `NEXT_PUBLIC_SOLANA_RPC_URL`    | Custom Helius/QuickNode RPC URL    |
| `NEXT_PUBLIC_FEE_WALLET`        | Platform fee collector address     |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key                  |

---

## Integration Checklist

### V1 (Connect + Create)
- [x] Wallet connection — Phantom, Solflare, Backpack
- [ ] Complete `createSplToken()` in `src/services/solana/tokenService.ts`
- [ ] Wire up Supabase DB in `src/app/api/tokens/route.ts`

### V2 (Trade)
- [ ] Deploy AMM on-chain program
- [ ] Complete `executeTrade()` in `src/services/solana/tradeService.ts`
- [ ] Wire up price feed / pool state RPC reads

### V3 (Charts + Analytics)
- [ ] Integrate Recharts price charts in token detail page
- [ ] Real-time websocket price updates
- [ ] Trending score algorithm in DB

### V4 (Launchpad)
- [ ] Bonding curve graduation logic
- [ ] Staking module
- [ ] Anti-bot / rate limiting middleware

---

## Design System

**Color Palette**

| Token           | Value                  |
|-----------------|------------------------|
| Background      | `#08080f`              |
| Surface 1–4     | `#0d0d1a` → `#1c1c38` |
| Gold            | `#fbbf24`              |
| Positive (green)| `#22c55e`              |
| Negative (red)  | `#ef4444`              |

**CSS Utilities**

- `.text-gradient-gold` — gold gradient text
- `.glass-card` — glassmorphism card
- `.glow-gold` — gold box shadow glow
- `.price-up` / `.price-down` — semantic price colors

---

## Deploy

**Frontend:** [Vercel](https://vercel.com) — connect repo, set env vars  
**Database:** [Supabase](https://supabase.com)  
**Backend (optional):** Railway or Render  

---

## Architecture Notes

- All Solana transaction functions in `src/services/solana/` require a **connected wallet signer**. Private keys are never stored client-side.
- The AMM quote calculation (`calculateTradeQuote`) is pure math — no RPC calls — making it instant.
- `buttonVariants` is deliberately split from `Button.tsx` into `button-variants.ts` so it can be imported in both server and client components.
- The Wallet Context wraps all providers and exposes a clean `useNavorixWallet()` hook.
