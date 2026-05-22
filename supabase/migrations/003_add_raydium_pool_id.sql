-- ============================================================
--  Migration: 003_add_raydium_pool_id.sql
--  Adds raydium_pool_id column to pools table
-- ============================================================

ALTER TABLE public.pools
  ADD COLUMN IF NOT EXISTS raydium_pool_id text;

COMMENT ON COLUMN public.pools.raydium_pool_id IS
  'Raydium CPMM pool address (base58). NULL until pool is created on-chain.';

CREATE INDEX IF NOT EXISTS idx_pools_raydium_id
  ON public.pools (raydium_pool_id)
  WHERE raydium_pool_id IS NOT NULL;
