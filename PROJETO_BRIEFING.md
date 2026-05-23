# Navorix Exchange — Briefing Completo do Projeto

> Passe este arquivo para qualquer IA que for continuar o desenvolvimento.

---

## O que é

Plataforma Web3 estilo Pump.fun na blockchain Solana.
Permite criar tokens SPL, fazer trading e fornecer liquidez.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Estilo | TailwindCSS v4 + CSS variables |
| Blockchain | Solana mainnet-beta |
| Banco | Supabase (PostgreSQL) |
| DEX / Swap | Raydium CPMM SDK v2 |
| Metadados | Metaplex UMI + Arweave/Irys |
| Storage | Supabase Storage (bucket: token-images) |
| Deploy | Vercel (Hobby plan) |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Charts | Recharts |
| Notificações | Sonner |

---

## Infraestrutura Ativa

| Serviço | URL / Endereço |
|---|---|
| Site em produção | https://navorix-exchange.vercel.app |
| Repositório GitHub | https://github.com/saeellcostta/Navorix |
| Supabase projeto | https://onnrvuahjzfhxvcdvzif.supabase.co |
| Carteira de taxas | `FvmN4BnLKR25QWXXoLof2RZFzwC8XU3QLcPr1aJg1UvQ` |

---

## Variáveis de Ambiente

Arquivo `.env.local` (nunca commitar no GitHub):

```
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=
NEXT_PUBLIC_SUPABASE_URL=https://onnrvuahjzfhxvcdvzif.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ATD8z_guVYv3xZoPoPXZHw_Kw2zJVEv
SUPABASE_SERVICE_ROLE_KEY=sb_secret_95xI3n1JsqWlsSLOraOAYg_AQLQIZeA
NEXT_PUBLIC_FEE_WALLET=FvmN4BnLKR25QWXXoLof2RZFzwC8XU3QLcPr1aJg1UvQ
NEXT_PUBLIC_SITE_URL=https://navorix-exchange.vercel.app
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=token-images
CRON_SECRET=navorix2026secret
```

---

## Banco de Dados (Supabase)

### Tabelas

| Tabela | Função |
|---|---|
| `users` | Carteiras conectadas (upsert automático) |
| `tokens` | Tokens criados na plataforma |
| `token_stats` | Preço, market cap, volume, holders |
| `pools` | Pools Raydium (reservas, liquidez) |
| `trades` | Histórico de trades on-chain |

### View
- `tokens_trending` — score composto:
  - 40% volume SOL 24h (tabela trades)
  - 25% número de transações 24h
  - 20% variação de preço positiva
  - 10% liquidez total
  - 5% bônus tokens criados há < 24h

---

## Sistema de Taxas

| Operação | Taxa | Destino |
|---|---|---|
| Criação de token | 0.02 SOL (fixo) | Carteira de taxas |
| Compra inicial no lançamento | Variável (usuário escolhe) | Carteira de taxas |
| Cada trade (buy/sell) | 1% do valor | Raydium (pool fee) |
| Taxa de lançamento | 1 SOL = 100.000.000 tokens | — |

---

## Carteiras Suportadas

- Phantom (mobile: deep link `phantom.app/ul/browse/...`)
- Solflare (mobile: deep link `solflare.com/ul/v1/browse/...`)
- Backpack
- Coinbase Wallet
- Trust Wallet (mobile: `link.trustwallet.com/open_url?coin_id=501&url=...`)
- Bitget Wallet
- Ledger (hardware)

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── page.tsx                    → Dashboard (/)
│   ├── tokens/page.tsx             → Marketplace (/tokens)
│   ├── token/[mint]/page.tsx       → Detalhe + Trade (/token/:mint)
│   ├── create/page.tsx             → Criar token (/create)
│   ├── pools/page.tsx              → Pools (/pools)
│   ├── portfolio/page.tsx          → Portfolio (/portfolio)
│   ├── trending/page.tsx           → Trending (/trending)
│   ├── not-found.tsx               → Página 404
│   ├── layout.tsx                  → Root layout + providers
│   ├── globals.css                 → Design system (preto/ouro)
│   └── api/
│       ├── tokens/route.ts         → GET/POST tokens
│       ├── tokens/[mint]/route.ts  → GET token por mint
│       ├── pools/route.ts          → GET pools
│       ├── trades/route.ts         → GET/POST trades
│       ├── user/route.ts           → POST upsert usuário
│       ├── health/route.ts         → GET health check
│       └── cron/update-stats/      → GET indexer de preços
│
├── components/
│   ├── ui/                         → Button, Card, Badge, Input, Modal, Tabs, Skeleton, PriceChange
│   ├── layout/                     → Navbar, Footer, ErrorBoundary
│   ├── wallet/                     → WalletButton, WalletSelectModal, ConnectWalletButton
│   ├── token/                      → TokenCard, TokenCreatorForm, TradePanel, PriceChart, TradeHistory, InitialBuyPanel, LaunchCostSummary
│   ├── marketplace/                → TokensGrid, TokensFilter, TrendingClient
│   ├── pools/                      → PoolCard, PoolsListClient
│   └── dashboard/                  → HeroSection, StatsBar, TrendingSection, PortfolioClient
│
├── contexts/
│   └── WalletContext.tsx           → ConnectionProvider + WalletProvider + auto upsert user
│
├── hooks/
│   ├── useSolBalance.ts            → Saldo SOL da carteira conectada
│   ├── useTokens.ts                → Lista de tokens com filtros
│   ├── useTradeQuote.ts            → Quote AMM (math puro, sem RPC)
│   ├── useSwap.ts                  → Quote + execução via Raydium
│   └── useTokenCreation.ts         → Fluxo completo de criação (6 steps)
│
├── services/
│   ├── solana/
│   │   ├── tokenService.ts         → createSplToken, getSolBalance, getTokenAccounts
│   │   ├── tradeService.ts         → calculateTradeQuote, executeTrade
│   │   ├── raydiumService.ts       → createCpmmPool, getSwapQuote, executeSwap
│   │   ├── metadataService.ts      → buildMetadataJson, uploadOffChainMetadata, createOnChainMetadata
│   │   └── priceIndexer.ts         → runPriceIndexer (chamado pelo cron)
│   ├── storage/
│   │   └── imageService.ts         → uploadTokenImage (Supabase Storage)
│   ├── db/
│   │   ├── tokenDbService.ts       → getTokens, getTokenByMint, insertToken, upsertTokenStats
│   │   ├── poolDbService.ts        → getPools, getPoolByMint, upsertPool
│   │   └── tradeDbService.ts       → recordTrade, getTradesByMint, getTradesByWallet
│   └── api/
│       └── tokenApi.ts             → fetchTokens, registerToken, recordTrade, upsertUserOnConnect
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               → createBrowserClient (use client)
│   │   ├── server.ts               → createServerClient (use server)
│   │   ├── admin.ts                → createAdminClient (service role)
│   │   ├── types.ts                → Database type definitions
│   │   └── index.ts                → exports
│   ├── rateLimit.ts                → Rate limiter IP-based in-memory
│   ├── phantomMobile.ts            → Deep link helpers para mobile
│   └── utils.ts                    → cn() helper (clsx + tailwind-merge)
│
├── config/
│   ├── solana.ts                   → RPC, taxas, programa IDs, solToTokensAtLaunch()
│   └── site.ts                     → Nav links, SEO, SITE_URL, SITE_NAME
│
├── types/
│   ├── token.ts                    → Token, TokenMetadata, TokenStats, TokenCreateInput
│   ├── pool.ts                     → LiquidityPool, BondingCurveState, PoolPosition
│   ├── trade.ts                    → TradeInput, TradeQuote, TradeTransaction
│   ├── wallet.ts                   → WalletState, WalletBalance, TokenBalance
│   └── user.ts                     → User, UserStats
│
├── utils/
│   ├── format.ts                   → formatUsd, formatSol, shortenAddress, formatPct, timeAgo
│   └── validation.ts               → isValidPublicKey, isValidTokenSymbol
│
└── middleware.ts                   → Rate limiting em /api/* + guard /api/cron/*
```

---

## Rotas da API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/tokens` | Listar tokens (sort, limit, offset) |
| POST | `/api/tokens` | Registrar novo token após criação on-chain |
| GET | `/api/tokens/[mint]` | Detalhe de um token |
| GET | `/api/pools` | Listar pools ativas |
| GET | `/api/trades` | Histórico (`?mint=` ou `?wallet=`) |
| POST | `/api/trades` | Registrar trade confirmado |
| POST | `/api/user` | Upsert usuário por wallet address |
| GET | `/api/health` | Status do sistema |
| GET | `/api/cron/update-stats` | Atualiza token_stats (chamado pelo Vercel Cron) |

---

## Fluxo de Criação de Token

```
1. Upload imagem     → Supabase Storage (bucket: token-images)
2. Upload metadados  → Irys/Arweave (JSON permanente)
3. Criar mint SPL    → 3 transações assinadas pelo Phantom
4. Metadados on-chain→ Metaplex Token Metadata PDA
5. Pool Raydium      → CPMM criada com SOL da compra inicial
6. Salvar no banco   → POST /api/tokens → aparece no marketplace
```

---

## Fluxo de Buy/Sell

```
1. Usuário digita valor → getSwapQuote() calcula output (Raydium CurveCalculator)
2. Clica Comprar/Vender → executeSwap() via raydium.cpmm.swap()
3. Phantom assina a tx
4. Confirmado on-chain
5. recordTrade() salva no banco
6. Link Solscan aparece
```

---

## Anti-bot / Rate Limiting

Aplicado via `src/middleware.ts` em todas as rotas `/api/*`:

| Rota | Limite |
|---|---|
| POST /api/tokens | 5 por minuto por IP |
| POST /api/trades | 30 por minuto por IP |
| GET /api/* | 120 por minuto por IP |
| /api/cron/* | Só com CRON_SECRET no header |

---

## Mobile (Phantom e carteiras)

- Detecta mobile via `navigator.userAgent`
- Abre o site dentro do browser da carteira via deep link:
  - Phantom: `phantom.app/ul/browse/{url}`
  - Solflare: `solflare.com/ul/v1/browse/{url}`
  - Trust: `link.trustwallet.com/open_url?coin_id=501&url={url}`
- ErrorBoundary captura crashes e mostra botão "Limpar e Recarregar"
- Script no `<head>` limpa localStorage corrompido antes do React carregar

---

## O que já está funcionando

- [x] Criar token SPL on-chain (mainnet)
- [x] Upload imagem para Supabase Storage
- [x] Metadados on-chain (Metaplex)
- [x] Pool Raydium CPMM criada automaticamente
- [x] Buy/Sell via Raydium SDK v2
- [x] Marketplace com busca e filtros
- [x] Trending real (score baseado em trades 24h)
- [x] Portfolio com tokens SPL da carteira
- [x] Gráfico de preço (dados simulados)
- [x] Histórico de trades
- [x] Rate limiting anti-bot
- [x] Deep link mobile Phantom/Solflare/Trust
- [x] Modal de seleção de carteiras customizado
- [x] Indexer de preços (cron 1x/dia, CoinGecko)
- [x] Health check `/api/health`
- [x] Deploy Vercel + Supabase em produção

---

## O que ainda pode ser feito

- [ ] Gráfico de preço com dados reais (indexer on-chain)
- [ ] Notificações via Telegram Bot
- [ ] Trending em tempo real com WebSocket / SSE
- [ ] Launchpad com countdown e página de lançamento dedicada
- [ ] Staking de tokens
- [ ] Sistema de boost (pagar SOL para ficar no topo)
- [ ] Página de perfil do criador
- [ ] Anti-rug indicators (lock de liquidez, verificação de contrato)
- [ ] Suporte a Token-2022 (nova versão do SPL Token)

---

## Migrations SQL (rodar no Supabase SQL Editor em ordem)

1. `supabase/migrations/001_initial_schema.sql` — tabelas + RLS + triggers
2. `supabase/migrations/002_trending_view.sql` — view original (substituída pela 004)
3. `supabase/migrations/003_add_raydium_pool_id.sql` — coluna raydium_pool_id em pools
4. `supabase/migrations/004_trending_real.sql` — view trending com dados reais

---

## Como rodar localmente

```bash
git clone https://github.com/saeellcostta/Navorix
cd Navorix
npm install
cp .env.example .env.local
# Preencher .env.local com as variáveis acima
npm run dev
# Abre http://localhost:3000
```

---

*Gerado automaticamente em 23/05/2026*
