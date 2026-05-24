"use client";

import React from "react";
import Link from "next/link";
import { Plus, TrendingUp, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:py-20 lg:py-24">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[500px] w-[800px] rounded-full
          bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.07)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-screen-xl text-center">
        {/* Label */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--gold-dim)] px-3 py-1">
          <Zap className="h-3.5 w-3.5 text-[var(--gold)]" />
          <span className="text-xs font-semibold text-[var(--gold)]">{t.hero.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
          <span className="text-[var(--text-primary)]">{t.hero.title1}</span>
          <br />
          <span className="text-gradient-gold">{t.hero.title2}</span>
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-[var(--text-secondary)] mb-8">
          {t.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/create" className={buttonVariants({ size: "lg" })}>
            <Plus className="h-5 w-5" />
            {t.hero.createToken}
          </Link>
          <Link href="/tokens" className={buttonVariants({ variant: "outline", size: "lg" })}>
            <TrendingUp className="h-5 w-5" />
            {t.hero.explore}
          </Link>
        </div>
      </div>
    </section>
  );
}
