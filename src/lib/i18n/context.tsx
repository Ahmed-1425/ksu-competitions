'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import arDict from '@/messages/ar.json';
import enDict from '@/messages/en.json';

export type Locale = 'ar' | 'en';

type Dictionary = typeof arDict;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, fallback?: string) => string;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
}

const dictionaries: Record<Locale, Dictionary> = {
  ar: arDict,
  en: enDict,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    const savedLocale = localStorage.getItem('ksu_locale') as Locale;
    if (savedLocale === 'ar' || savedLocale === 'en') {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('ksu_locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = dictionaries[locale];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to ar if not found in current locale
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let arFallback: any = dictionaries['ar'];
        for (const k of keys) {
          if (arFallback && typeof arFallback === 'object' && k in arFallback) {
            arFallback = arFallback[k];
          } else {
            return fallback || path;
          }
        }
        return typeof arFallback === 'string' ? arFallback : fallback || path;
      }
    }

    return typeof current === 'string' ? current : fallback || path;
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const isRtl = locale === 'ar';

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir, isRtl }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
