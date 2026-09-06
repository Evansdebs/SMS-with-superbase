'use client';

import React, { useEffect, useState } from 'react';
import { SUPPORTED_LANGUAGES, useI18n, initLanguagePreference, Language } from '@/lib/i18n';
import { Globe, Check } from 'lucide-react';

export function LanguageSelector() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentLanguage, setLanguage } = useI18n();

  useEffect(() => {
    initLanguagePreference();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-20 bg-slate-800/40 rounded-lg animate-pulse" />
    );
  }

  const activeOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        title="Change Language"
        aria-label="Change Language"
      >
        <span>{activeOption.flag}</span>
        <span className="uppercase font-semibold tracking-wider">{activeOption.code}</span>
        <Globe className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-1.5 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Select Language
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  currentLanguage === lang.code
                    ? 'bg-blue-600/20 text-blue-400 font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </span>
                {currentLanguage === lang.code && (
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
