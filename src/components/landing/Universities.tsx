'use client';

import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';

export default function Universities() {
  const { t, isRtl } = useI18n();

  const universities = [
    { name_ar: 'جامعة الملك سعود', name_en: 'King Saud University', slug: 'ksu', logo: '/universities/ksu.png', organizer: true },
    { name_ar: 'جامعة المعرفة', name_en: 'Almaarefa University', slug: 'almaarefa', logo: '/universities/almaarefa.jpeg' },
    { name_ar: 'جامعة الملك عبدالعزيز', name_en: 'King Abdulaziz University', slug: 'kau', logo: '/universities/kau.png' },
    { name_ar: 'جامعة القصيم', name_en: 'Qassim University', slug: 'qu', logo: '/universities/qu.png' },
    { name_ar: 'الجامعة الإسلامية بالمدينة المنورة', name_en: 'Islamic University of Madinah', slug: 'iu', logo: '/universities/iu.png' },
    { name_ar: 'جامعة الملك خالد', name_en: 'King Khalid University', slug: 'kku', logo: '/universities/kku.png' },
    { name_ar: 'جامعة حائل', name_en: 'University of Ha\'il', slug: 'uoh', logo: '/universities/uoh.png' },
    { name_ar: 'جامعة نجران', name_en: 'Najran University', slug: 'nu', logo: '/universities/nu.png' },
    { name_ar: 'جامعة الأمير سطام بن عبدالعزيز', name_en: 'Prince Sattam Bin Abdulaziz University', slug: 'psau', logo: '/universities/psau.png' },
    { name_ar: 'جامعة جدة', name_en: 'University of Jeddah', slug: 'uj', logo: '/universities/uj.png' },
  ];

  return (
    <section id="universities" className="py-24 bg-[#F8F7F4] border-t border-[#D7CFC1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F5A46] bg-white border border-[#D7CFC1] px-3.5 py-1.5 rounded-full shadow-xs">
            {t('nav.universities')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#142921] mt-4">
            {t('universities.title')}
          </h2>
          <p className="text-base sm:text-lg text-[#62776D] mt-3">
            {t('universities.subtitle')}
          </p>
        </div>

        {/* Grid of Universities with Prominently Enlarged Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {universities.map((uni) => (
            <div
              key={uni.slug}
              className={`glass-card p-6 md:p-8 flex flex-col items-center justify-between text-center transition-all hover-lift border min-h-[240px] ${
                uni.organizer
                  ? 'bg-gradient-to-b from-white to-[#C9A96A]/15 border-[#1F5A46] shadow-md ring-1 ring-[#1F5A46]/20'
                  : 'bg-white border-[#D7CFC1]'
              }`}
            >
              {/* Significantly Enlarged Logo Container */}
              <div className="relative w-full h-32 sm:h-36 flex items-center justify-center mb-4 p-2">
                <Image
                  src={uni.logo}
                  alt={`شعار ${uni.name_ar}`}
                  width={220}
                  height={120}
                  className="object-contain max-h-28 sm:max-h-32 w-auto drop-shadow-xs"
                />
              </div>

              {/* Title & Badge */}
              <div className="w-full">
                <h3 className="text-sm font-bold text-[#142921] leading-snug">
                  {isRtl ? uni.name_ar : uni.name_en}
                </h3>
                {uni.organizer && (
                  <span className="mt-2 text-[11px] font-bold text-[#1F5A46] bg-[#C9A96A]/30 px-2.5 py-0.5 rounded-full inline-block">
                    الجامعة المنظمة
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
