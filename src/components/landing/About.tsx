'use client';

import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="py-20 bg-white border-y border-[#D7CFC1]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F5A46] bg-[#1F5A46]/10 px-3.5 py-1.5 rounded-full border border-[#C9A96A]/30">
              {t('nav.about')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#142921] leading-tight">
              {t('about.title')}
            </h2>
            <p className="text-base sm:text-lg text-[#62776D] leading-relaxed">
              {t('about.description')}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A96A] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-[#2D3E36]">
                  معايير تقييم شفافة ودقيقة لضمان النزاهة وتكافؤ الفرص لجميع الطلاب والجامعات.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1F5A46] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-[#2D3E36]">
                  حماية كاملة للبيانات الشخصية ومرجعية موثوقة لكل مشاركة مسجلة عبر المنصة.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#C9A96A] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-[#2D3E36]">
                  تجربة إلكترونية سلسة وسريعة عبر الهواتف الذكية والأجهزة المحمولة.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative glass-card p-8 md:p-10 overflow-hidden border border-[#D7CFC1] bg-gradient-to-br from-white via-[#F8F7F4] to-[#C9A96A]/10">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#1F5A46]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-6 relative z-10">
                {/* Replaced KSU text box with Significantly Enlarged King Saud University Logo Image shifted right */}
                <div className="relative w-72 sm:w-80 md:w-[380px] h-28 sm:h-32 -mr-3 sm:-mr-5">
                  <Image
                    src="/universities/ksu.png"
                    alt="شعار جامعة الملك سعود"
                    fill
                    className="object-contain object-right"
                    priority
                  />
                </div>
                <h3 className="text-xl font-bold text-[#142921]">
                  منظومة إبداعية تشمل كافة الجامعات المشاركة
                </h3>
                <p className="text-sm text-[#62776D] leading-relaxed">
                  تتميز المنصة بمرونة مساراتها وتكاملها المعرفي البصري والميداني، بما يسهم في رصد الأثر الطلابي وصقل المواهب الجامعية.
                </p>
                <div className="pt-4 border-t border-[#D7CFC1] flex items-center justify-between text-xs text-[#62776D]">
                  <span>إشراف وتنظيم: لجنة عمداء شؤون الطلاب</span>
                  <span className="font-bold text-[#1F5A46]">جامعة الملك سعود</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
