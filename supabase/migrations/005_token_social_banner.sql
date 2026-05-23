-- ============================================================
--  Migration: 005_token_social_banner.sql
--  Adiciona links sociais e banner aos tokens
-- ============================================================

ALTER TABLE public.tokens
  ADD COLUMN IF NOT EXISTS banner_url   text,
  ADD COLUMN IF NOT EXISTS twitter_url  text,
  ADD COLUMN IF NOT EXISTS telegram_url text,
  ADD COLUMN IF NOT EXISTS website_url  text,
  ADD COLUMN IF NOT EXISTS discord_url  text;

COMMENT ON COLUMN public.tokens.banner_url   IS 'URL do banner do token (Supabase Storage)';
COMMENT ON COLUMN public.tokens.twitter_url  IS 'Link do Twitter/X do projeto';
COMMENT ON COLUMN public.tokens.telegram_url IS 'Link do grupo Telegram';
COMMENT ON COLUMN public.tokens.website_url  IS 'Site oficial do projeto';
COMMENT ON COLUMN public.tokens.discord_url  IS 'Link do servidor Discord';
