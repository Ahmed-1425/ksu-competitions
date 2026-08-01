'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { AlertCircle, MousePointerClick, UserCheck, Link2, Hash } from 'lucide-react';

export default function Steps() {
  const { t } = useI18n();

  const stepsList = [
    {
      num: '1',
      icon: MousePointerClick,
      title: t('steps.step1Title'),
      desc: t('steps.step1Desc'),
    },
    {
      num: '2',
      icon: UserCheck,
      title: t('steps.step2Title'),
      desc: t('steps.step2Desc'),
    },
    {
      num: '3',
      icon: Link2,
      title: t('steps.step3Title'),
      desc: t('steps.step3Desc'),
    },
    {
      num: '4',
      icon: Hash,
      title: t('steps.step4Title'),
      desc: t('steps.step4Desc'),
    },
  ];

  return (
    <section id="steps" className="py-24 bg-white border-t border-[#D7CFC1]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F5A46] bg-[#1F5A46]/10 px-3.5 py-1.5 rounded-full border border-[#C9A96A]/30">
            {t('nav.howToParticipate')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#142921] mt-4">
            {t('steps.title')}
          </h2>
          <p className="text-base sm:text-lg text-[#62776D] mt-3">
            {t('steps.subtitle')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {stepsList.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className="relative glass-card p-6 border border-[#D7CFC1] bg-[#F8F7F4]/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-full bg-[#1F5A46] text-[#C9A96A] flex items-center justify-center font-bold text-base shadow-xs border border-[#C9A96A]/30">
                      {step.num}
                    </span>
                    <Icon className="w-6 h-6 text-[#1F5A46]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#142921]">{step.title}</h3>
                  <p className="text-xs text-[#62776D] mt-2 leading-relaxed">{step.desc}</p>
                </div>

                {idx < stepsList.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-[#C9A96A]">
                    <span className="text-xl font-bold">←</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Google Drive Permissions Alert Notice */}
        <div className="mt-12 max-w-4xl mx-auto glass-card p-6 md:p-8 border-l-4 border-l-[#1F5A46] bg-gradient-to-r from-[#F8F7F4] to-white border-[#D7CFC1]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#1F5A46]/10 text-[#1F5A46] shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#142921]">
                {t('steps.driveNoticeTitle')}
              </h4>
              <p className="text-sm text-[#2D3E36] leading-relaxed">
                {t('steps.driveNoticeDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
