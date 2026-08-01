'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { FileText, Camera, Compass, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Competitions() {
  const { t, isRtl } = useI18n();

  const tracks = [
    {
      key: 'report',
      icon: FileText,
      badge: t('competitions.report.badge'),
      title: t('competitions.report.title'),
      tagline: t('competitions.report.tagline'),
      description: t('competitions.report.description'),
    },
    {
      key: 'photo',
      icon: Camera,
      badge: t('competitions.photo.badge'),
      title: t('competitions.photo.title'),
      tagline: t('competitions.photo.tagline'),
      description: t('competitions.photo.description'),
    },
    {
      key: 'passport',
      icon: Compass,
      badge: t('competitions.passport.badge'),
      title: t('competitions.passport.title'),
      tagline: t('competitions.passport.tagline'),
      description: t('competitions.passport.description'),
    },
  ];

  return (
    <section id="competitions" className="py-24 bg-[#F8F7F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F5A46] bg-white border border-[#D7CFC1] px-3.5 py-1.5 rounded-full shadow-xs">
            {t('nav.competitions')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#142921] mt-4">
            {t('competitions.title')}
          </h2>
          <p className="text-base sm:text-lg text-[#62776D] mt-3">
            {t('competitions.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tracks.map((track) => {
            const Icon = track.icon;

            return (
              <div
                key={track.key}
                className="glass-card hover-lift p-8 flex flex-col justify-between relative group border border-[#D7CFC1] bg-white"
              >
                <div>
                  {/* Badge & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-2xl bg-[#F8F7F4] text-[#1F5A46] border border-[#D7CFC1]">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-[#1F5A46] bg-[#C9A96A]/20 px-3 py-1 rounded-full border border-[#C9A96A]/40">
                      {track.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-bold text-[#142921] group-hover:text-[#1F5A46] transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs font-bold text-[#C9A96A] mt-2 mb-4 leading-normal">
                    {track.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[#62776D] leading-relaxed">
                    {track.description}
                  </p>
                </div>

                {/* Footer CTA button */}
                <div className="mt-8 pt-6 border-t border-[#E5E0D5]">
                  <Link
                    href={`/register?competition=${track.key}`}
                    className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-[#F8F7F4] text-[#1F5A46] font-bold text-sm border border-[#D7CFC1] hover:bg-[#1F5A46] hover:text-white hover:border-[#1F5A46] transition-all shadow-xs"
                  >
                    <span>{t('competitions.registerForThis')}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
