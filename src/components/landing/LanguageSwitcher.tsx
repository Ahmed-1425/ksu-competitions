'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#142921] bg-white border border-[#D7CFC1] hover:border-[#1F5A46] hover:text-[#1F5A46] transition-all shadow-xs"
      aria-label="Switch language / تغيير اللغة"
    >
      <Globe className="w-3.5 h-3.5 text-[#1F5A46]" />
      <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
}
