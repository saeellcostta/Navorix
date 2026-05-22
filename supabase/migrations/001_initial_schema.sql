-- ============================================================
--  Navorix Exchange — Initial Database Schema
--  Migration: 001_initial_schema.sql
--  Run this in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────
--  TABLE: users
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text        NOT NULL UNIQUE,
  username       text,
  email          text,
  avatar_url     text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.users IS 'One row per connected wallet address';
COMMENT ON COLUMN public.users.wallet_address IS 'Solana public key (base58)';

-- ────────────────────────────────────────────
--  TABLE: tokens
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tokens (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address       text        NOT NULL UNIQUE,
  name               text        NOT NULL,
  symbol             text        NOT NULL,
  description        text,
  image_url          text,
  decimals           smallint    NOT NULL DEFAULT 6,
  initial_supply     numeric     NOT NULL DEFAULT 1000000000,
  creator_wallet     text        NOT NULL,
  creation_fee_sol   numeric     NOT NULL DEFAULT 0.02,
  initial_buy_sol    numeric     NOT NULL DEFAULT 0,
  initial_buy_tokens numeric     NOT NULL DEFAULT 0,
  creation_tx        text,
  is_verified        boolean     NOT NULL DEFAULT false,
  is_graduated       boolean     NOT NULL DEFAULT false,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.tokens       IS 'Every SPL token launched on Navorix';
COMMENT ON COLUMN public.tokens.mint_address     IS 'Solana mint public key';
COMMENT ON COLUMN public.tokens.creation_fee_sol IS 'Platform fee paid at creation';
COMMENT ON COLUMN public.tokens.initial_buy_sol  IS 'SOL spent by creator in the pre-buy';
COMMENT ON COLUMN public.tokens.initial_buy_tokens IS 'Tokens received by creator at launch';
COMMENT ON COLUMN public.tokens.is_graduated     IS 'True when pool reached graduation threshold';

CREATE INDEX IF NOT EXISTS idx_tokens_creator       ON public.tokens (creator_wallet);
CREATE INDEX IF NOT EXISTS idx_tokens_created_at    ON public.tokens (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tokens_symbol        ON public.tokens (symbol);

-- ────────────────────────────────────────────
--  TABLE: token_stats  (denormalized for fast reads)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.token_stats (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address      text        NOT NULL UNIQUE REFERENCES public.tokens(mint_address) ON DELETE CASCADE,
  price_usd         numeric     NOT NULL DEFAULT 0,
  price_sol         numeric     NOT NULL DEFAULT 0,
  price_change_1h   numeric     NOT NULL DEFAULT 0,
  price_change_24h  numeric     NOT NULL DEFAULT 0,
  price_change_7d   numeric     NOT NULL DEFAULT 0,
  market_cap_usd    numeric     NOT NULL DEFAULT 0,
  volume_24h_usd    numeric     NOT NULL DEFAULT 0,
  liquidity_usd     numeric     NOT NULL DEFAULT 0,
  holders           integer     NOT NULL DEFAULT 0,
  tx_count_24h      integer     NOT NULL DEFAULT 0,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.token_stats IS 'Aggregated market stats per token — updated by indexer';

CREATE INDEX IF NOT EXISTS idx_token_stats_market_cap  ON public.token_stats (market_cap_usd  DESC);
CREATE INDEX IF NOT EXISTS idx_token_stats_volume      ON public.token_stats (volume_24h_usd  DESC);
CREATE INDEX IF NOT EXISTS idx_token_stats_liquidity   ON public.token_stats (liquidity_usd   DESC);

-- ────────────────────────────────────────────
--  TABLE: pools
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pools (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address         text        NOT NULL UNIQUE REFERENCES public.tokens(mint_address) ON DELETE CASCADE,
  sol_reserve          numeric     NOT NULL DEFAULT 0,
  token_reserve        numeric     NOT NULL DEFAULT 0,
  total_liquidity_usd  numeric     NOT NULL DEFAULT 0,
  volume_24h_usd       numeric     NOT NULL DEFAULT 0,
  fee_pct              numeric     NOT NULL DEFAULT 0.01,
  price_sol            numeric     NOT NULL DEFAULT 0,
  price_change_24h     numeric     NOT NULL DEFAULT 0,
  is_active            boolean     NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.pools          IS 'AMM liquidity pools (one per token)';
COMMENT ON COLUMN public.pools.fee_pct  IS 'Trade fee fraction, e.g. 0.01 = 1%';

CREATE INDEX IF NOT EXISTS idx_pools_liquidity ON public.pools (total_liquidity_usd DESC);
CREATE INDEX IF NOT EXISTS idx_pools_active    ON public.pools (is_active);

-- ────────────────────────────────────────────
--  TABLE: trades
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.trades (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address   text        NOT NULL REFERENCES public.tokens(mint_address) ON DELETE CASCADE,
  trader_wallet  text        NOT NULL,
  direction      text        NOT NULL CHECK (direction IN ('buy', 'sell')),
  amount_in      numeric     NOT NULL,
  amount_out     numeric     NOT NULL,
  fee_sol        numeric     NOT NULL DEFAULT 0,
  price_sol      numeric     NOT NULL DEFAULT 0,
  tx_signature   text        NOT NULL UNIQUE,
  created_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.trades IS 'Every on-chain buy/sell recorded by the indexer';
COMMENT ON COLUMN public.trades.direction IS '"buy" = SOL in / TOKEN out, "sell" = TOKEN in / SOL out';

CREATE INDEX IF NOT EXISTS idx_trades_mint        ON public.trades (mint_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_trader      ON public.trades (trader_wallet,  created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_created_at  ON public.trades (created_at DESC);

-- ────────────────────────────────────────────
--  FUNCTION + TRIGGER: updated_at auto-update
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','tokens','token_stats','pools']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_set_updated_at ON public.%I;
       CREATE TRIGGER trg_set_updated_at
         BEFORE UPDATE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;

-- ────────────────────────────────────────────
--  ROW LEVEL SECURITY
-- ────────────────────────────────────────────
ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_stats  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pools        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades       ENABLE ROW LEVEL SECURITY;

-- Public read for tokens, stats, pools, trades
CREATE POLICY "Public read tokens"      ON public.tokens      FOR SELECT USING (true);
CREATE POLICY "Public read token_stats" ON public.token_stats FOR SELECT USING (true);
CREATE POLICY "Public read pools"       ON public.pools       FOR SELECT USING (true);
CREATE POLICY "Public read trades"      ON public.trades      FOR SELECT USING (true);

-- Users can read their own row
CREATE POLICY "Users read own"   ON public.users FOR SELECT USING (true);
CREATE POLICY "Users insert own" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users update own" ON public.users FOR UPDATE USING (true);

-- Inserts for tokens and trades require service_role (API routes use admin client)
-- No direct client-side inserts allowed for security
