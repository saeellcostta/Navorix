"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type SortOption = "trending" | "new" | "marketcap" | "volume";

interface TokensFilterProps {
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const MAIN_FILTERS = [
  { value: "trending",  label: "🔥 Em alta" },
  { value: "new",       label: "✨ Novos" },
  { value: "marketcap", label: "💰 Market Cap" },
  { value: "volume",    label: "📊 Volume" },
] as const;

export function TokensFilter({
  sort,
  onSortChange,
  search,
  onSearchChange,
}: TokensFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <Input
        placeholder="Buscar por nome, símbolo ou endereço..."
        leftAdornment={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {MAIN_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onSortChange(f.value as SortOption)}
            className={cn(
              "flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-150 cursor-pointer border",
              sort === f.value
                ? "bg-[var(--gold)] text-[#08080f] border-[var(--gold)] shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                : "bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
