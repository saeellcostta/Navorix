"use client";

import React from "react";
import { Coins, Droplets, BarChart3, Users } from "lucide-react";
import { StatCard } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";

export function StatsBar() {
  const { t } = useLanguage();

  const STATS = [
    { key: "totalTokens",    icon: <Coins className="h-5 w-5" /> },
    { key: "totalLiquidity", icon: <Droplets className="h-5 w-5" /> },
    { key: "volume24h",      icon: <BarChart3 className="h-5 w-5" /> },
    { key: "activeTraders",  icon: <Users className="h-5 w-5" /> },
  ] as const;

  return (
    <section className="px-4 pb-8">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(({ key, icon }) => (
            <StatCard
              key={key}
              label={t.stats[key]}
              value="—"
              subValue={t.stats.loading}
              icon={icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
