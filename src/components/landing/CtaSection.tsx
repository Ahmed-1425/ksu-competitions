'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function CtaSection() {
  const { t, isRtl } = useI18n();

  return (
    <section className="py-20 bg-ksu-mesh relative overflow-hidden border-t border-[#D7CFC1]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="glass-card p-10 md:p-16 border-2 border-[#1F5A46]/20 bg-white/95 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#1F5A46]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#C9A96A]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F5A46]/10 text-[#1F5A46] text-xs font-bold mb-4 border border-[#C9A96A]/30">
            <Sparkles className="w-4 h-4 text-[#C9A96A]" />
            <span>جامعة الملك سعود</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#142921] leading-tight">
            {t('cta.title')}
          </h2>

          <p className="text-base sm:text-lg text-[#62776D] mt-4 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-[#1F5A46] text-white font-bold text-lg hover:bg-[#174535] transition-all shadow-lg hover:shadow-xl active:scale-98"
            >
              <span>{t('cta.button')}</span>
              {isRtl ? <ArrowLeft className="w-5 h-5 text-[#C9A96A]" /> : <ArrowRight className="w-5 h-5 text-[#C9A96A]" />}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
