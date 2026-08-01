'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-white border-t border-[#D7CFC1] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-[#D7CFC1]/60">
          {/* Dual Logos Brand in Footer: Balanced & Centered relative to Vertical Divider */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative w-36 sm:w-44 h-14 sm:h-16 flex items-center justify-center">
                <Image
                  src="/brand/committee-logo.png"
                  alt="شعار لجنة عمداء شؤون الطلاب للجامعات السعودية"
                  fill
                  className="object-contain object-center"
                />
              </div>
              <div className="w-[1.5px] h-9 bg-[#D7CFC1] shrink-0" />
              <div className="relative w-36 sm:w-44 h-14 sm:h-16 flex items-center justify-center">
                <Image
                  src="/universities/ksu.png"
                  alt="شعار جامعة الملك سعود"
                  fill
                  className="object-contain object-center"
                />
              </div>
            </div>
            <p className="text-xs text-[#62776D]">
              المنصة الرسمية لمسابقات لجنة عمداء شؤون الطلاب للجامعات السعودية | بتنظيم جامعة الملك سعود
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-[#2D3E36]">
            <Link href="/privacy" className="hover:text-[#1F5A46] font-bold transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="hover:text-[#1F5A46] font-bold transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="/admin/login" className="inline-flex items-center gap-1.5 hover:text-[#1F5A46] transition-colors text-xs font-semibold text-[#62776D] bg-[#F8F7F4] px-3.5 py-1.5 rounded-full border border-[#D7CFC1]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F5A46]" />
              <span>{t('nav.adminDashboard')}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Footer Signature Text */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#62776D]">
          <p className="font-bold text-[#142921]">
            لجنة عمداء شؤون الطلاب للجامعات السعودية | بتنظيم جامعة الملك سعود
          </p>
          <p>© {new Date().getFullYear()} {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
