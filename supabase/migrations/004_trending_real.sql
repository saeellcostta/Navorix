-- ============================================================
--  Migration: 004_trending_real.sql
--  Trending score baseado em dados reais de trades das últimas 24h
-- ============================================================

-- Substitui a view anterior com score baseado em volume real
CREATE OR REPLACE VIEW public.tokens_trending AS
WITH volume_24h AS (
  SELECT
    mint_address,
    COALESCE(SUM(
      CASE direction
        WHEN 'buy'  THEN amount_in   -- SOL gasto em compras
        WHEN 'sell' THEN amount_out  -- SOL recebido em vendas
      END
    ), 0) AS volume_sol_24h,
    COUNT(*) AS tx_count_24h,
    COUNT(DISTINCT trader_wallet) AS unique_traders_24h
  FROM public.trades
  WHERE created_at > now() - interval '24 hours'
  GROUP BY mint_address
),
price_change AS (
  -- Compara preço atual com preço de 24h atrás
  SELECT
    mint_address,
    price_sol AS price_now,
    FIRST_VALUE(price_sol) OVER (
      PARTITION BY mint_address
      ORDER BY created_at ASC
    ) AS price_24h_ago
  FROM public.trades
  WHERE created_at > now() - interval '24 hours'
)
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

  -- Preço e stats do token_stats (atualizado pelo indexer)
  COALESCE(s.price_usd,        0) AS price_usd,
  COALESCE(s.price_sol,        0) AS price_sol,
  COALESCE(s.price_change_24h, 0) AS price_change_24h,
  COALESCE(s.market_cap_usd,   0) AS market_cap_usd,
  COALESCE(s.liquidity_usd,    0) AS liquidity_usd,
  COALESCE(s.holders,          0) AS holders,

  -- Volume 24h calculado dos trades reais (prioridade) ou do token_stats
  COALESCE(v.volume_sol_24h, s.volume_24h_usd / 145.0, 0)   AS volume_sol_24h,
  COALESCE(s.volume_24h_usd, v.volume_sol_24h * 145.0, 0)   AS volume_24h_usd,
  COALESCE(v.tx_count_24h, s.tx_count_24h, 0)               AS tx_count_24h,
  COALESCE(v.unique_traders_24h, 0)                          AS unique_traders_24h,

  -- ── TRENDING SCORE ──────────────────────────────────────
  --  40% volume 24h (SOL)
  --  25% número de trades únicos
  --  20% variação de preço positiva
  --  10% liquidez
  --   5% bônus recência (token novo < 24h)
  (
    COALESCE(v.volume_sol_24h,   0) * 0.40 +
    COALESCE(v.tx_count_24h,     0) * 0.25 +
    GREATEST(COALESCE(s.price_change_24h, 0), 0) * 0.20 +
    COALESCE(s.liquidity_usd,    0) / 10000.0 * 0.10 +
    CASE WHEN t.created_at > now() - interval '24 hours' THEN 500 ELSE 0 END * 0.05
  ) AS trending_score

FROM public.tokens t
LEFT JOIN public.token_stats s ON s.mint_address = t.mint_address
LEFT JOIN volume_24h           v ON v.mint_address = t.mint_address
ORDER BY trending_score DESC;

COMMENT ON VIEW public.tokens_trending IS
  'Tokens sorted by real trending score: 40% volume, 25% tx count, 20% price momentum, 10% liquidity, 5% recency';
