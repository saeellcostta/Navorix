import React from "react";
import Link from "next/link";
import { Zap, MessageCircle, Globe, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface-1)]">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#fbbf24] to-[#d97706]">
              <Zap className="h-4 w-4 text-[#08080f]" fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-gradient-gold">Navorix Exchange</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--text-muted)]">
            <Link href="/tokens"  className="hover:text-[var(--gold)] transition-colors">Marketplace</Link>
            <Link href="/create"  className="hover:text-[var(--gold)] transition-colors">Create Token</Link>
            <Link href="/pools"   className="hover:text-[var(--gold)] transition-colors">Pools</Link>
            <Link href="/trending" className="hover:text-[var(--gold)] transition-colors">Trending</Link>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {[
              { Icon: Globe,          href: "#", label: "Twitter / X" },
              { Icon: MessageCircle,  href: "#", label: "Discord" },
              { Icon: Code2,          href: "#", label: "GitHub" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--gold)] transition-all duration-150"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--border)] pt-4 text-center text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} Navorix Exchange. Built on Solana.
          &nbsp;·&nbsp; Trading involves risk. DYOR.
        </div>
      </div>
    </footer>
  );
}
