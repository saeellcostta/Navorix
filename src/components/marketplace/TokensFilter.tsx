"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useLanguage } from "@/contexts/LanguageContext";

type SortOption = "trending" | "new" | "marketcap" | "volume";

interface TokensFilterProps {
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

export function TokensFilter({ sort, onSortChange, search, onSearchChange }: TokensFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <Input
          placeholder={t.marketplace.searchPlaceholder}
          leftAdornment={<Search className="h-4 w-4" />}
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      <Tabs defaultValue={sort} value={sort} onValueChange={v => onSortChange(v as SortOption)}>
        <TabsList className="shrink-0 w-full sm:w-auto">
          <TabsTrigger value="trending">{t.marketplace.hot}</TabsTrigger>
          <TabsTrigger value="new">{t.marketplace.new}</TabsTrigger>
          <TabsTrigger value="marketcap">{t.marketplace.cap}</TabsTrigger>
          <TabsTrigger value="volume">{t.marketplace.vol}</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
