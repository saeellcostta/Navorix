"use client";

import React, {
  createContext, useContext, useState, useEffect, useCallback,
} from "react";
import {
  TRANSLATIONS,
  detectLanguage,
  type LangCode,
  type Translations,
} from "@/lib/i18n/translations";

const STORAGE_KEY = "navorix_lang";

interface LanguageContextValue {
  lang:      LangCode;
  t:         Translations;
  setLang:   (code: LangCode) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("pt-BR");

  // On mount: read localStorage → fallback to browser detection
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
      if (stored && TRANSLATIONS[stored]) {
        setLangState(stored);
      } else {
        setLangState(detectLanguage());
      }
    } catch {
      setLangState(detectLanguage());
    }
  }, []);

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
  }, []);

  const t = TRANSLATIONS[lang] ?? TRANSLATIONS["en"];

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
