-- ============================================================
--  Navorix Exchange — Development Seed Data
--  Populates sample tokens so the UI shows data locally.
--  Run ONLY on devnet / local Supabase instance.
-- ============================================================

-- Sample tokens
INSERT INTO public.tokens
  (mint_address, name, symbol, description, image_url, decimals, initial_supply, creator_wallet, creation_fee_sol, initial_buy_sol, initial_buy_tokens)
VALUES
  ('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', 'Bonk',          'BONK', 'The Solana dog coin',        NULL, 5, 93585142.0,  'BoNKseeder111111111111111111111111111111111', 0.02, 1.0, 100000000),
  ('7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', 'Popcat',        'POPCAT', 'Meow meow meme token',     NULL, 9, 979920.0,   'PoPcAtSeeDer1111111111111111111111111111111', 0.02, 0.5, 50000000),
  ('MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',  'cat in a dogs world', 'MEW', 'Cats rule Solana',      NULL, 6, 888888888.0, 'MEWseeder11111111111111111111111111111111111', 0.02, 0.25, 25000000)
ON CONFLICT (mint_address) DO NOTHING;

-- Sample token stats
INSERT INTO public.token_stats
  (mint_address, price_usd, price_sol, price_change_24h, market_cap_usd, volume_24h_usd, liquidity_usd, holders, tx_count_24h)
VALUES
  ('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', 0.000024, 0.00000014, 12.5,  22300000, 4500000, 3200000, 847000, 92000),
  ('7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', 0.72,     0.0042,     -3.2,  701000000, 28000000, 52000000, 64000, 210000),
  ('MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',  0.0091,   0.000053,   7.8,   8100000,  920000,   4200000,  31000, 44000)
ON CONFLICT (mint_address) DO NOTHING;

-- Sample pools
INSERT INTO public.pools
  (mint_address, sol_reserve, token_reserve, total_liquidity_usd, volume_24h_usd, fee_pct, price_sol, price_change_24h)
VALUES
  ('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', 18800, 1342800000000, 3200000, 4500000, 0.01, 0.00000014, 12.5),
  ('7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', 306000, 72900000,     52000000, 28000000, 0.01, 0.0042,    -3.2),
  ('MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',  24600, 464800000,     4200000, 920000,   0.01, 0.000053,    7.8)
ON CONFLICT (mint_address) DO NOTHING;
