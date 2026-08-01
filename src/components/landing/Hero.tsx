'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { motion } from 'framer-motion';
import { Award, Layers, Building2, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Hero() {
  const { t, isRtl } = useI18n();

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-ksu-mesh">
      {/* Decorative Green & Gold Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1F5A46]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#C9A96A]/12 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Sponsorship Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[#C9A96A]/40 shadow-xs text-[#1F5A46] text-xs md:text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#C9A96A]" />
            <span>{t('hero.sponsorBadge')}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#142921] leading-[1.15]"
          >
            {t('hero.title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-[#62776D] leading-relaxed max-w-3xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#1F5A46] text-white text-base font-bold hover:bg-[#174535] transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              <span>{t('hero.registerNow')}</span>
              {isRtl ? <ArrowLeft className="w-5 h-5 text-[#C9A96A]" /> : <ArrowRight className="w-5 h-5 text-[#C9A96A]" />}
            </Link>

            <a
              href="#competitions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-white text-[#1F5A46] text-base font-bold border border-[#D7CFC1] hover:bg-[#F8F7F4] transition-all shadow-xs"
            >
              <span>{t('hero.exploreCompetitions')}</span>
            </a>
          </motion.div>

          {/* Stat Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            <div className="glass-card p-4 flex items-center justify-center gap-3 border-[#D7CFC1]/60">
              <div className="p-2.5 rounded-xl bg-[#1F5A46]/10 text-[#1F5A46]">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#2D3E36]">{t('hero.statTracks')}</span>
            </div>

            <div className="glass-card p-4 flex items-center justify-center gap-3 border-[#D7CFC1]/60">
              <div className="p-2.5 rounded-xl bg-[#1F5A46]/10 text-[#1F5A46]">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#2D3E36]">{t('hero.statUniversities')}</span>
            </div>

            <div className="glass-card p-4 flex items-center justify-center gap-3 border-[#D7CFC1]/60">
              <div className="p-2.5 rounded-xl bg-[#C9A96A]/20 text-[#1F5A46]">
                <Award className="w-5 h-5 text-[#C9A96A]" />
              </div>
              <span className="text-sm font-semibold text-[#2D3E36]">{t('hero.statImpact')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
