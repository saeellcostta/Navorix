"use client";

import React from "react";
import { Coins, Droplets, BarChart3, Users } from "lucide-react";
import { StatCard } from "@/components/ui/Card";

const STATS = [
  {
    label: "Total Tokens",
    value: "—",
    subValue: "Loading...",
    icon: <Coins className="h-5 w-5" />,
  },
  {
    label: "Total Liquidity",
    value: "—",
    subValue: "Loading...",
    icon: <Droplets className="h-5 w-5" />,
  },
  {
    label: "24h Volume",
    value: "—",
    subValue: "Loading...",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Active Traders",
    value: "—",
    subValue: "Loading...",
    icon: <Users className="h-5 w-5" />,
  },
] as const;

export function StatsBar() {
  return (
    <section className="px-4 pb-8">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              subValue={stat.subValue}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
