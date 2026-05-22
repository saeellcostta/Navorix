/**
 * Supabase Database type definitions.
 * These mirror the SQL schema in /supabase/migrations/001_initial_schema.sql
 *
 * Run `npx supabase gen types typescript --project-id <id>` to auto-regenerate
 * once you have the Supabase project linked.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wallet_address: string;
          username: string | null;
          email: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          username?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };

      tokens: {
        Row: {
          id: string;
          mint_address: string;
          name: string;
          symbol: string;
          description: string | null;
          image_url: string | null;
          decimals: number;
          initial_supply: number;
          creator_wallet: string;
          creation_fee_sol: number;
          initial_buy_sol: number;
          initial_buy_tokens: number;
          creation_tx: string | null;
          is_verified: boolean;
          is_graduated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mint_address: string;
          name: string;
          symbol: string;
          description?: string | null;
          image_url?: string | null;
          decimals?: number;
          initial_supply?: number;
          creator_wallet: string;
          creation_fee_sol?: number;
          initial_buy_sol?: number;
          initial_buy_tokens?: number;
          creation_tx?: string | null;
          is_verified?: boolean;
          is_graduated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tokens"]["Insert"]>;
      };

      token_stats: {
        Row: {
          id: string;
          mint_address: string;
          price_usd: number;
          price_sol: number;
          price_change_1h: number;
          price_change_24h: number;
          price_change_7d: number;
          market_cap_usd: number;
          volume_24h_usd: number;
          liquidity_usd: number;
          holders: number;
          tx_count_24h: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mint_address: string;
          price_usd?: number;
          price_sol?: number;
          price_change_1h?: number;
          price_change_24h?: number;
          price_change_7d?: number;
          market_cap_usd?: number;
          volume_24h_usd?: number;
          liquidity_usd?: number;
          holders?: number;
          tx_count_24h?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["token_stats"]["Insert"]>;
      };

      pools: {
        Row: {
          id: string;
          mint_address: string;
          sol_reserve: number;
          token_reserve: number;
          total_liquidity_usd: number;
          volume_24h_usd: number;
          fee_pct: number;
          price_sol: number;
          price_change_24h: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mint_address: string;
          sol_reserve?: number;
          token_reserve?: number;
          total_liquidity_usd?: number;
          volume_24h_usd?: number;
          fee_pct?: number;
          price_sol?: number;
          price_change_24h?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pools"]["Insert"]>;
      };

      trades: {
        Row: {
          id: string;
          mint_address: string;
          trader_wallet: string;
          direction: "buy" | "sell";
          amount_in: number;
          amount_out: number;
          fee_sol: number;
          price_sol: number;
          tx_signature: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          mint_address: string;
          trader_wallet: string;
          direction: "buy" | "sell";
          amount_in: number;
          amount_out: number;
          fee_sol?: number;
          price_sol?: number;
          tx_signature: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trades"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
