"use client";

import React, { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANG_LABELS, LANG_FLAGS, type LangCode } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const LANGS = Object.keys(LANG_LABELS) as LangCode[];

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5",
          "border border-[var(--border)] bg-[var(--surface-2)]",
          "text-xs font-medium text-[var(--text-secondary)]",
          "hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
          "transition-colors cursor-pointer"
        )}
        aria-label="Selecionar idioma"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{LANG_FLAGS[lang]}</span>
        <ChevronDown className={cn(
          "h-3 w-3 transition-transform duration-200",
          open && "rotate-180"
        )} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className={cn(
            "absolute right-0 top-full mt-2 z-40",
            "w-44 rounded-xl border border-[var(--border-strong)]",
            "bg-[var(--surface-2)] shadow-2xl shadow-black/60",
            "py-1 overflow-hidden"
          )}>
            {LANGS.map(code => (
              <button
                key={code}
                onClick={() => { setLang(code); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2",
                  "text-sm transition-colors cursor-pointer",
                  lang === code
                    ? "bg-[var(--gold-dim)] text-[var(--gold)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)]"
                )}
              >
                <span className="text-base leading-none">{LANG_FLAGS[code]}</span>
                <span className="flex-1 text-left">{LANG_LABELS[code]}</span>
                {lang === code && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
