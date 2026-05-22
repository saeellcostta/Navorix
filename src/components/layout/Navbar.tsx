"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  TrendingUp,
  Plus,
  Droplets,
  Wallet,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/components/wallet/WalletButton";
import { NAV_LINKS } from "@/config/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Coins,
  TrendingUp,
  Plus,
  Droplets,
  Wallet,
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "transition-all duration-300",
          scrolled
            ? "bg-[var(--surface-1)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#fbbf24] to-[#d97706] shadow-[0_0_12px_rgba(251,191,36,0.4)]">
              <Zap className="h-4.5 w-4.5 text-[#08080f]" fill="currentColor" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-gradient-gold">Navorix</span>
              <span className="text-[var(--text-secondary)] font-medium ml-1 text-sm hidden sm:inline">
                Exchange
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href, icon }) => {
              const Icon = iconMap[icon];
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3.5 py-2",
                    "text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-[var(--gold-dim)] text-[var(--gold)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Network indicator */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-[var(--surface-3)] border border-[var(--border)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--positive)] animate-pulse" />
              <span className="text-xs text-[var(--text-muted)] font-medium">
                {process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "devnet"}
              </span>
            </div>

            <WalletButton />

            {/* Mobile hamburger */}
            <button
              className={cn(
                "lg:hidden flex h-10 w-10 items-center justify-center rounded-lg",
                "border border-[var(--border)] bg-[var(--surface-2)]",
                "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                "transition-colors"
              )}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className={cn(
              "fixed top-16 left-0 right-0 z-35 lg:hidden",
              "bg-[var(--surface-1)] border-b border-[var(--border)]",
              "px-4 py-3"
            )}
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href, icon }) => {
                const Icon = iconMap[icon];
                const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3",
                      "text-sm font-semibold transition-all duration-150",
                      isActive
                        ? "bg-[var(--gold-dim)] text-[var(--gold)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
