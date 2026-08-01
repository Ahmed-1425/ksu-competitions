'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function Faq() {
  const { t } = useI18n();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  return (
    <section id="faq" className="py-24 bg-white border-t border-[#D7CFC1]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F5A46] bg-[#1F5A46]/10 px-3.5 py-1.5 rounded-full border border-[#C9A96A]/30">
            {t('nav.faq')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#142921] mt-4">
            {t('faq.title')}
          </h2>
          <p className="text-base sm:text-lg text-[#62776D] mt-3">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className={`glass-card overflow-hidden border transition-all duration-200 ${
                  isOpen ? 'border-[#1F5A46] bg-[#F8F7F4]/60 shadow-xs' : 'border-[#D7CFC1] bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-start flex items-center justify-between gap-4 font-bold text-base md:text-lg text-[#142921] hover:text-[#1F5A46] transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#1F5A46] shrink-0" />
                    <span>{item.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#1F5A46] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#C9A96A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-[#2D3E36] leading-relaxed border-t border-[#D7CFC1]/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
