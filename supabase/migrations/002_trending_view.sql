-- ============================================================
--  Migration: 002_trending_view.sql
--  Trending score view — used by GET /api/tokens?sort=trending
-- ============================================================

CREATE OR REPLACE VIEW public.tokens_trending AS
SELECT
  t.id,
  t.mint_address,
  t.name,
  t.symbol,
  t.description,
  t.image_url,
  t.decimals,
  t.initial_supply,
  t.creator_wallet,
  t.is_verified,
  t.is_graduated,
  t.created_at,

  -- Stats
  COALESCE(s.price_usd,        0) AS price_usd,
  COALESCE(s.price_sol,        0) AS price_sol,
  COALESCE(s.price_change_24h, 0) AS price_change_24h,
  COALESCE(s.market_cap_usd,   0) AS market_cap_usd,
  COALESCE(s.volume_24h_usd,   0) AS volume_24h_usd,
  COALESCE(s.liquidity_usd,    0) AS liquidity_usd,
  COALESCE(s.holders,          0) AS holders,
  COALESCE(s.tx_count_24h,     0) AS tx_count_24h,

  -- Trending score:
  --   40% volume weight + 30% price momentum + 20% liquidity + 10% recency
  (
    COALESCE(s.volume_24h_usd,   0) * 0.40 +
    COALESCE(s.price_change_24h, 0) * 0.30 +
    COALESCE(s.liquidity_usd,    0) * 0.20 +
    -- Recency: tokens created in last 24h get a +1000 boost
    CASE WHEN t.created_at > now() - interval '24 hours' THEN 1000 ELSE 0 END * 0.10
  ) AS trending_score

FROM public.tokens t
LEFT JOIN public.token_stats s ON s.mint_address = t.mint_address
ORDER BY trending_score DESC;

COMMENT ON VIEW public.tokens_trending IS
  'Tokens sorted by composite trending score (volume + momentum + liquidity + recency)';
